import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from './ai.service';
import { GenerateProjectPlanDto } from './dto/generate-project-plan.dto';
import { SaveProjectPlanDto } from './dto/save-project-plan.dto';
import { UpdateProjectPlanDto } from './dto/update-project-plan.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LLMService } from './llm/llm.service';

function getAuthenticatedUserId(req: Request): string {
  const user = req.user;

  if (
    !user ||
    typeof user !== 'object' ||
    !('id' in user) ||
    typeof (user as { id?: unknown }).id !== 'string'
  ) {
    throw new UnauthorizedException('Authentication required');
  }

  return (user as { id: string }).id;
}

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
    private readonly llmService: LLMService,
  ) {}

  @Post('project-plan')
  async generatePlan(@Body() body: GenerateProjectPlanDto) {
    return this.aiService.generateProjectPlan(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('project-plan/save')
  savePlan(@Req() req: Request, @Body() body: SaveProjectPlanDto) {
    const userId = getAuthenticatedUserId(req);
    return this.aiService.saveProjectPlan(userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('project-plan')
  getSavedPlans(@Req() req: Request) {
    const userId = getAuthenticatedUserId(req);
    return this.aiService.getSavedPlans(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('project-plan/:id')
  getSavedPlan(@Req() req: Request, @Param('id') id: string) {
    const userId = getAuthenticatedUserId(req);
    return this.aiService.getSavedPlan(userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('project-plan/:id')
  updateSavedPlan(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: UpdateProjectPlanDto,
  ) {
    const userId = getAuthenticatedUserId(req);
    return this.aiService.updateSavedPlan(userId, id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('project-plan/:id')
  deleteSavedPlan(@Req() req: Request, @Param('id') id: string) {
    const userId = getAuthenticatedUserId(req);
    return this.aiService.deleteSavedPlan(userId, id);
  }

  @Post('team-recommendation')
  async recommendTeam(
    @Body()
    body: {
      projectTitle: string;
      projectDescription: string;
      userId?: string;
    },
  ) {
    const members = await this.prisma.user.findMany({
      where: {
        role: 'MASTER',
      },
      select: {
        id: true,
        name: true,
        skills: true,
        experience: true,
        rating: true,
      },
    });

    return this.aiService.recommendTeam(
      body.projectTitle,
      body.projectDescription,
      members,
      body.userId,
    );
  }

  @Post('test-groq')
  async testGroq() {
    const response = await this.llmService.generate(
      'Introduce yourself in one sentence.',
    );

    return {
      success: true,
      provider: 'Groq',
      response,
    };
  }

  @Post('chat')
  async chat(@Body() body: { message: string }) {
    const response = await this.llmService.generate(body.message);

    return {
      success: true,
      provider: 'Groq',
      response,
    };
  }
}
