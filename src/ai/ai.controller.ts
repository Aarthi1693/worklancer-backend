import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('project-plan')
  async generatePlan(@Body() body: { title: string }) {
    return await this.aiService.generateProjectPlan(body.title);
  }
}
