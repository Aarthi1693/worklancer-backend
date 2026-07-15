import { Controller, Get, Param } from '@nestjs/common';
import { CareerAiService } from './career-ai.service';

@Controller('career-ai')
export class CareerAiController {
  constructor(
    private readonly careerAiService: CareerAiService,
  ) {}

  @Get(':userId')
  analyzeCareer(
    @Param('userId') userId: string,
  ) {
    return this.careerAiService.analyzeCareer(userId);
  }
}