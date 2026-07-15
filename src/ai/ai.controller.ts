import { Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from './ai.service';

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