import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notifications/notifications.service';
import { NotificationType } from '@prisma/client';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly notifications: NotificationService,

    @Inject(forwardRef(() => ChatGateway))
    private readonly chatGateway: ChatGateway,
  ) {}

  async createConversation(
    projectId: string,
    providerId: string,
    masterId: string,
  ) {
    const existingConversation = await this.prisma.conversation.findFirst({
      where: {
        projectId,
        providerId,
        masterId,
      },
    });

    if (existingConversation) {
      return existingConversation;
    }

    return this.prisma.conversation.create({
      data: {
        projectId,
        providerId,
        masterId,
      },
    });
  }

  async getConversations(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [
          {
            providerId: userId,
          },
          {
            masterId: userId,
          },
        ],
      },

      include: {
        project: true,

        provider: true,

        master: true,

        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },

      orderBy: {
        updatedAt: 'desc',
      },
    });

    return Promise.all(
      conversations.map(async (conversation) => {
        const unreadCount = await this.prisma.message.count({
          where: {
            conversationId: conversation.id,
            senderId: {
              not: userId,
            },
            isRead: false,
          },
        });

        return {
          ...conversation,
          unreadCount,
        };
      }),
    );
  }

  async sendMessage(conversationId: string, senderId: string, message: string) {
    const saved = await this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        message,
        isRead: false,
        readAt: null,
      },
    });

    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (conversation) {
      const recipientId =
        conversation.providerId === senderId
          ? conversation.masterId
          : conversation.providerId;

      const isViewing = this.chatGateway.isUserInConversation(
        recipientId,
        conversationId,
      );

      if (!isViewing) {
        await this.notifications.notify({
          userId: recipientId,
          type: NotificationType.CHAT,
          title: 'New Message',
          message: message,
        });
      }
    }

    return saved;
  }

  async markMessagesRead(conversationId: string, userId: string) {
    return this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: {
          not: userId,
        },
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  getMessages(conversationId: string) {
    return this.prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
