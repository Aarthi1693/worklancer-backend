import { Module } from '@nestjs/common';
import { CareerAiController } from './career-ai.controller';
import { CareerAiService } from './career-ai.service';

import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [PrismaModule, AiModule],
  providers: [CareerAiService],
  controllers: [CareerAiController],
})
export class CareerAiModule {}
