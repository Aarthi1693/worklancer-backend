import { Module } from '@nestjs/common';
import { KycController } from './controllers/kyc.controller';
import { KycService } from './services/kyc.service';
import { PrismaModule } from '../prisma/prisma.module';
import { OcrModule } from '../ocr/ocr.module';
import { AiModule } from '../ai/ai.module';
import { FaceService } from './services/face.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, OcrModule, AiModule, NotificationsModule],
  controllers: [KycController],
  providers: [KycService, FaceService],
})
export class KycModule {}
