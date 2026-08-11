import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../multer.config';
import { KycService } from '../services/kyc.service';
import { CreatePersonalInfoDto } from '../dto/create-personal-info.dto';

@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('personal-info/:userId')
  savePersonalInfo(
    @Param('userId') userId: string,
    @Body() dto: CreatePersonalInfoDto,
  ) {
    return this.kycService.savePersonalInfo(userId, dto);
  }

  @Get('status/:userId')
  getStatus(@Param('userId') userId: string) {
    return this.kycService.getStatus(userId);
  }

  @Post('documents/:type/:userId')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadDocument(
    @Param('type') type: string,
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      return {
        success: false,
        message: 'No file received',
      };
    }

    return this.kycService.uploadDocument(userId, type, file.filename);
  }

  @Post('verify/:userId')
  verifyKyc(@Param('userId') userId: string) {
    return this.kycService.verifyKyc(userId);
  }
}
