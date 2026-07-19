import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { GeminiService } from './gemini/gemini.service';
import { PromptService } from './prompt/prompt.service';

@Module({
  imports: [PrismaModule],
  controllers: [AiController],
  providers: [AiService, GeminiService, PromptService],
  exports: [AiService, GeminiService, PromptService],
})
export class AiModule {}
