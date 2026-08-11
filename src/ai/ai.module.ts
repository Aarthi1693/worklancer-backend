import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { PromptService } from './prompt/prompt.service';
import { LLMService } from './llm/llm.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, AuthModule, NotificationsModule],
  controllers: [AiController],
  providers: [AiService, LLMService, PromptService],
  exports: [AiService, LLMService, PromptService],
})
export class AiModule {}
