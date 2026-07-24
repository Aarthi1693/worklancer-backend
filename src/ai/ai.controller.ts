import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from './ai.service';
import { SaveProjectPlanDto } from './dto/save-project-plan.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
  ) {}

  @Post('project-plan')
  async generatePlan(@Body() body: { title: string }) {
    return this.aiService.generateProjectPlan(body.title);
  }

  @UseGuards(JwtAuthGuard)
  @Post('project-plan/save')
  savePlan(@Req() req: Request, @Body() body: SaveProjectPlanDto) {
    const userId = getAuthenticatedUserId(req);

    return this.aiService.saveProjectPlan(userId, body);
  }

  @Post('team-recommendation')
  async recommendTeam(
    @Body()
    body: {
      projectTitle: string;
      projectDescription: string;
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
    );
  }
}
