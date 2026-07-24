import { Controller, Get, Patch, UseGuards, Body, Req } from '@nestjs/common';
import { ProfileService } from '../profile/profile.service';
import { UpdateProfileDto } from '../profile/dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/guards/roles.guard';
import type { Request } from 'express';

@Controller('provider-profile')
export class ProviderProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    const userId = (req.user as any)?.id;
    return this.profileService.getProfile(userId);
  }

  @Patch()
  @UseGuards(JwtAuthGuard, Roles('PROVIDER'))
  updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = (req.user as any)?.id;
    return this.profileService.updateProfile(userId, updateProfileDto);
  }
}
