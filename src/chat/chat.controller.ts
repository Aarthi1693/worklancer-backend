import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Post('conversation')
  createConversation(
    @Body() body: { projectId: string; providerId: string; masterId: string },
  ) {
    return this.chatService.createConversation(
      body.projectId,
      body.providerId,
      body.masterId,
    );
  }

  @Get('conversations/:userId')
  getConversations(@Param('userId') userId: string) {
    return this.chatService.getConversations(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('message')
  sendMessage(
    @Body() body: { conversationId: string; message: string },
    @Req() req: { user: { id: string } },
  ) {
    return this.chatService.sendMessage(
      body.conversationId,
      req.user.id,
      body.message,
    );
  }

  @Get('messages/:conversationId')
  getMessages(
    @Param('conversationId')
    conversationId: string,
  ) {
    return this.chatService.getMessages(conversationId);
  }

  @Get('online-users')
  getOnlineUsers() {
    return { userIds: this.chatGateway.getOnlineUserIds() };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('messages/:conversationId/read')
  markMessagesRead(
    @Param('conversationId')
    conversationId: string,
    @Req() req: { user: { id: string } },
  ) {
    return this.chatService.markMessagesRead(conversationId, req.user.id);
  }
}
