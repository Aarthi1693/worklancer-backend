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

  // =============================
  // CREATE NOTIFICATION
  // =============================
  async notify(payload: NotificationPayload) {
    if (!payload.userId) {
      throw new Error('userId is required');
    }

    const notification = await this.prisma.notification.create({
      data: {
        userId: payload.userId,
        type: payload.type,
        title: payload.title,
        message: payload.message,
      },
    });

    if (this.server) {
      this.server
        .to(userRoom(payload.userId))
        .emit('notificationCreated', notification);
    }

    return notification;
  }

  // =============================
  // GET ALL
  // =============================
  async getUserNotifications(
    userId: string,
    filters?: {
      type?: NotificationType;
      isRead?: boolean;
      search?: string;
      sortBy?: 'newest' | 'oldest';
    },
  ) {
    const where: Record<string, unknown> = { userId };

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.isRead !== undefined) {
      where.isRead = filters.isRead;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { message: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const notifications = await this.prisma.notification.findMany({
      where,
      orderBy: {
        createdAt: filters?.sortBy === 'oldest' ? 'asc' : 'desc',
      },
    });

    return notifications.map((n) => ({
  id: n.id,
  title: n.title,
  message: n.message,
  type: n.type,
  isRead: n.isRead,
  createdAt: n.createdAt,
}));
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  // =============================
  // MARK ONE READ
  // =============================
  async markAsRead(id: string) {
    const notification = await this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
      },
    });

    if (this.server) {
      this.server
        .to(userRoom(notification.userId))
        .emit('notificationRead', id);
    }

    return {
      success: true,
    };
  }

  // =============================
  // MARK ALL READ
  // =============================
  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    if (this.server) {
      this.server.to(userRoom(userId)).emit('allNotificationsRead');
    }

    return {
      success: true,
    };
  }

  // =============================
  // DELETE
  // =============================
  async deleteNotification(id: string) {
    const notification = await this.prisma.notification.delete({
      where: {
        id,
      },
    });

    if (this.server) {
      this.server
        .to(userRoom(notification.userId))
        .emit('notificationDeleted', id);
    }

    return {
      success: true,
    };
  }

  async clearAll(userId: string) {
  await this.prisma.notification.deleteMany({
    where: {
      userId,
    },
  });

  if (this.server) {
    this.server
      .to(userRoom(userId))
      .emit("notificationsCleared");
  }

  return {
    success: true,
  };
}

  // =============================
  // TIME FORMAT
  // =============================
  private getTimeAgo(date: Date): string {
    const diff = Date.now() - date.getTime();

    const mins = Math.floor(diff / 60000);

    if (mins < 1) return 'Just now';

    if (mins < 60) return `${mins} min ago`;

    const hrs = Math.floor(mins / 60);

    if (hrs < 24) return `${hrs} hr ago`;

    const days = Math.floor(hrs / 24);

    if (days === 1) return 'Yesterday';

    return `${days} days ago`;
  }
}
