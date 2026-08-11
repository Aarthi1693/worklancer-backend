import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject, forwardRef } from '@nestjs/common';

import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import {
  NotificationService,
  userRoom,
} from '../notifications/notifications.service';

interface SocketUser {
  id: string;
  email: string;
  role: string;
}

function conversationRoom(conversationId: string): string {
  return `conversation:${conversationId}`;
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly socketUser = new Map<string, string>();

  private readonly userSockets = new Map<string, Set<string>>();

  private readonly activeConversations = new Map<string, Set<string>>();

  constructor(
    @Inject(forwardRef(() => ChatService))
private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly notifications: NotificationService,
  ) {}

  afterInit() {
    this.notifications.setSocketServer(this.server);
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token as string | undefined;

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'worklancer-secret',
      });

      const user: SocketUser = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };

      client.data.user = user;
      client.join(userRoom(user.id));
      this.trackSocket(client.id, user.id);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user as SocketUser | undefined;

    if (!user) {
      return;
    }

    this.untrackSocket(client.id, user.id);
  }

  private trackSocket(socketId: string, userId: string) {
    const wasOffline = !this.userSockets.get(userId)?.size;

    this.socketUser.set(socketId, userId);

    const sockets = this.userSockets.get(userId) ?? new Set<string>();

    sockets.add(socketId);
    this.userSockets.set(userId, sockets);

    if (wasOffline) {
      this.server.emit('userOnline', { userId });
    }
  }

  private untrackSocket(socketId: string, userId: string) {
    this.socketUser.delete(socketId);

    const sockets = this.userSockets.get(userId);

    if (sockets) {
      sockets.delete(socketId);

      if (sockets.size === 0) {
        this.userSockets.delete(userId);
        this.server.emit('userOffline', { userId });
      }
    }
  }

  getOnlineUserIds(): string[] {
    return Array.from(this.userSockets.keys());
  }

  isUserInConversation(userId: string, conversationId: string): boolean {
    const conversations = this.activeConversations.get(userId);
    return conversations?.has(conversationId) ?? false;
  }

  @SubscribeMessage('joinConversation')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const user = client.data.user as SocketUser | undefined;
    if (user) {
      const conversations =
        this.activeConversations.get(user.id) ?? new Set<string>();
      conversations.add(data.conversationId);
      this.activeConversations.set(user.id, conversations);
    }
    client.join(conversationRoom(data.conversationId));
  }

  @SubscribeMessage('leaveConversation')
  handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const user = client.data.user as SocketUser | undefined;
    if (user) {
      const conversations = this.activeConversations.get(user.id);
      if (conversations) {
        conversations.delete(data.conversationId);
        if (conversations.size === 0) {
          this.activeConversations.delete(user.id);
        }
      }
    }
    client.leave(conversationRoom(data.conversationId));
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; message: string },
  ) {
    const user = client.data.user as SocketUser | undefined;

    if (!user) {
      return;
    }

    const saved = await this.chatService.sendMessage(
      data.conversationId,
      user.id,
      data.message,
    );

    this.server
      .to(conversationRoom(data.conversationId))
      .emit('receiveMessage', saved);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const user = client.data.user as SocketUser | undefined;

    if (!user) {
      return;
    }

    client.to(conversationRoom(data.conversationId)).emit('typing', {
      userId: user.id,
      conversationId: data.conversationId,
    });
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const user = client.data.user as SocketUser | undefined;

    if (!user) {
      return;
    }

    client.to(conversationRoom(data.conversationId)).emit('stopTyping', {
      userId: user.id,
      conversationId: data.conversationId,
    });
  }
}
