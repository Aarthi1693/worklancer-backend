import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard)
  @Post('notifications/broadcast/all')
  broadcastToAll(@Body() body: { title: string; message: string }) {
    return this.adminService.broadcastToAll(body.title, body.message);
  }

  @UseGuards(JwtAuthGuard)
  @Post('notifications/broadcast/providers')
  broadcastToProviders(@Body() body: { title: string; message: string }) {
    return this.adminService.broadcastToProviders(body.title, body.message);
  }

  @UseGuards(JwtAuthGuard)
  @Post('notifications/broadcast/masters')
  broadcastToMasters(@Body() body: { title: string; message: string }) {
    return this.adminService.broadcastToMasters(body.title, body.message);
  }

  @UseGuards(JwtAuthGuard)
  @Post('notifications/send')
  sendToUser(@Body() body: { userId: string; title: string; message: string }) {
    return this.adminService.sendToUser(body.userId, body.title, body.message);
  }
}
