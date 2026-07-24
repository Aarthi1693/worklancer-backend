import { Module } from '@nestjs/common';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';
import { AuthModule } from '../auth/auth.module';
import { MasterGuard } from './guards/master.guard';

@Module({
  imports: [PrismaModule, AiModule, AuthModule],
  controllers: [KycController],
  providers: [KycService, MasterGuard],
  exports: [KycService],
})
export class KycModule {}
