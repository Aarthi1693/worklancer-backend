import {
  Controller,
  Get,
  Patch,
  Put,
  UseGuards,
  Body,
  UploadedFile,
  BadRequestException,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProfileService, ProviderStats, MasterStats } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

function avatarFileName(req: any, file: any, cb: any) {
  const ext = extname(file.originalname);
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  cb(null, `avatar-${req.user?.id || 'unknown'}-${uniqueSuffix}${ext}`);
}

function resumeFileName(req: any, file: any, cb: any) {
  const ext = extname(file.originalname);
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  cb(null, `resume-${req.user?.id || 'unknown'}-${uniqueSuffix}${ext}`);
}

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    const userId = (req.user as any)?.id;
    return this.profileService.getProfile(userId);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = (req.user as any)?.id;
    return this.profileService.updateProfile(userId, updateProfileDto);
  }

  @Get('stats/provider')
  @UseGuards(JwtAuthGuard)
  async getProviderStats(@Req() req: Request): Promise<ProviderStats> {
    const userId = (req.user as any)?.id;
    return this.profileService.getProviderStats(userId);
  }

  @Get('stats/master')
  @UseGuards(JwtAuthGuard)
  async getMasterStats(@Req() req: Request): Promise<MasterStats> {
    const userId = (req.user as any)?.id;
    return this.profileService.getMasterStats(userId);
  }

  @Patch('image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: 'uploads/',
        filename: avatarFileName,
      }),
      fileFilter: (req: any, file: any, cb: any) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadAvatar(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = (req.user as any)?.id;

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const avatarUrl = `/uploads/${file.filename}`;
    return this.profileService.updateAvatar(userId, avatarUrl);
  }

  @Patch('resume')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: diskStorage({
        destination: 'uploads/',
        filename: resumeFileName,
      }),
      fileFilter: (req: any, file: any, cb: any) => {
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (!allowedTypes.includes(file.mimetype)) {
          return cb(
            new BadRequestException('Only PDF and Word documents are allowed'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  async uploadResume(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = (req.user as any)?.id;

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const resumeUrl = `/uploads/${file.filename}`;
    return this.profileService.updateResume(userId, resumeUrl);
  }
}
