import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { KycService } from './kyc.service';
import { UpdateKycPersonalInfoDto } from './dto/update-kyc.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MasterGuard } from './guards/master.guard';

@Controller('kyc')
@UseGuards(JwtAuthGuard, MasterGuard)
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Get('status')
  getStatus(@Request() req: any) {
    return this.kycService.getStatus(req.user.id);
  }

  @Post('personal-info')
  updatePersonalInfo(
    @Request() req: any,
    @Body() data: UpdateKycPersonalInfoDto,
  ) {
    return this.kycService.updatePersonalInfo(req.user.id, data);
  }

  @Post('documents')
  uploadDocuments(
    @Request() req: any,
    @Body()
    data: {
      profilePhoto?: string;
      selfie?: string;
      idPhoto?: string;
      panCard?: string;
    },
  ) {
    return this.kycService.uploadDocuments(req.user.id, data);
  }

  @Post('verify')
  verify(@Request() req: any) {
    return this.kycService.simulateVerification(req.user.id);
  }
}
