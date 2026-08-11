import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notifications/notifications.service';
import { NotificationType, Role } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async broadcastToAll(title: string, message: string) {
    const users = await this.prisma.user.findMany({
      select: { id: true },
    });

    const results: unknown[] = [];
    for (const user of users) {
      const notification = await this.notificationService.notify({
        userId: user.id,
        type: NotificationType.SYSTEM,
        title,
        message,
      });
      results.push(notification);
    }

    return { count: results.length, notifications: results };
  }

  async broadcastToProviders(title: string, message: string) {
    const providers = await this.prisma.user.findMany({
      where: { role: Role.PROVIDER },
      select: { id: true },
    });

    const results: unknown[] = [];
    for (const provider of providers) {
      const notification = await this.notificationService.notify({
        userId: provider.id,
        type: NotificationType.SYSTEM,
        title,
        message,
      });
      results.push(notification);
    }

    return { count: results.length, notifications: results };
  }

  async broadcastToMasters(title: string, message: string) {
    const masters = await this.prisma.user.findMany({
      where: { role: Role.MASTER },
      select: { id: true },
    });

    const results: unknown[] = [];
    for (const master of masters) {
      const notification = await this.notificationService.notify({
        userId: master.id,
        type: NotificationType.SYSTEM,
        title,
        message,
      });
      results.push(notification);
    }

    return { count: results.length, notifications: results };
  }

  async sendToUser(userId: string, title: string, message: string) {
    const notification = await this.notificationService.notify({
      userId,
      type: NotificationType.SYSTEM,
      title,
      message,
    });

    return notification;
  }
}
