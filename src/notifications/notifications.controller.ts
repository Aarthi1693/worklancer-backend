import { Controller, Get, Param, Patch } from '@nestjs/common';
import { NotificationService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifications: NotificationService) {}

  @Get(':userId')
  getUserNotifications(@Param('userId') userId: string) {
    return this.notifications.getUserNotifications(userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notifications.markAsRead(id);
  }

  @Patch('read-all/:userId')
  markAllAsRead(@Param('userId') userId: string) {
    return this.notifications.markAllAsRead(userId);
  }
}
