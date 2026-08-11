import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { ProviderService } from './provider.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('provider')
export class ProviderController {
  constructor(
    private readonly providerService: ProviderService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.providerService.getDashboardStats();
  }

  @Get('projects')
  getProjects() {
    return this.providerService.getProjects();
  }

  @Get('assigned-masters')
  @UseGuards(JwtAuthGuard)
  getAssignedMasters(@Req() req: Request) {
    const providerId = (req.user as any).id;

    return this.providerService.getAssignedMasters(providerId);
  }
}