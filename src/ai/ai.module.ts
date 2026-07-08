import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { GeminiService } from './gemini/gemini.service';
import { PromptService } from './prompt/prompt.service';

@Module({
  controllers: [AiController],
  providers: [AiService, GeminiService, PromptService],
})
export class AiModule {}
