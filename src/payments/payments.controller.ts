import { Controller, Get, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('provider')
  @UseGuards(JwtAuthGuard)
  findByProvider(@Req() req: Request) {
    const providerId = (req.user as any)?.id;
    return this.paymentsService.findByProvider(providerId);
  }

  @Get('master')
  @UseGuards(JwtAuthGuard)
  findByMaster(@Req() req: Request) {
    const userId = (req.user as any)?.id;
    return this.paymentsService.findByMaster(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findBySubmissionId(id);
  }

  @Patch(':id/release')
  @UseGuards(JwtAuthGuard)
  release(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any)?.id;
    return this.paymentsService.release(id, userId);
  }
}
