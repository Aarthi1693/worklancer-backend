import { Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';

import { NotificationService } from './notifications.service';
import { NotificationType } from '@prisma/client';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifications: NotificationService) {}

  @Get('unread-count/:userId')
  getUnreadCount(@Param('userId') userId: string) {
    return this.notifications.getUnreadCount(userId);
  }

  @Get(':userId')
  getUserNotifications(
    @Param('userId') userId: string,
    @Query()
    query: {
      type?: NotificationType;
      isRead?: string;
      search?: string;
      sortBy?: 'newest' | 'oldest';
    },
  ) {
    return this.notifications.getUserNotifications(userId, {
      type: query.type,
      isRead: query.isRead !== undefined ? query.isRead === 'true' : undefined,
      search: query.search,
      sortBy: query.sortBy,
    });
  }

  @Patch('read-all/:userId')
  markAllAsRead(@Param('userId') userId: string) {
    return this.notifications.markAllAsRead(userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notifications.markAsRead(id);
  }

  @Delete('clear-all/:userId')
clearAll(@Param('userId') userId: string) {
  return this.notifications.clearAll(userId);
}

  @Delete(':id')
  deleteNotification(@Param('id') id: string) {
    return this.notifications.deleteNotification(id);
  }
}
