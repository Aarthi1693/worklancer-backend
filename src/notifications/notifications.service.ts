import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
import { Server } from 'socket.io';

export interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

export function userRoom(userId: string): string {
  return `user:${userId}`;
}

@Injectable()
export class NotificationService {
  private server: Server | null = null;

  constructor(private prisma: PrismaService) {}

  setSocketServer(server: Server) {
    this.server = server;
  }

  async notify(payload: NotificationPayload) {
    if (!payload.userId) {
      throw new Error('userId is required to send notification');
    }

    const notification = await this.prisma.notification.create({
      data: {
        userId: payload.userId,
        type: payload.type,
        title: payload.title,
        message: payload.message,
      },
    });

    // Real-time notification
    if (this.server) {
      this.server.to(userRoom(payload.userId)).emit('notification', {
        ...notification,
        data: payload.data ?? {},
      });
    }

    return notification;
  }

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
      },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }
}
