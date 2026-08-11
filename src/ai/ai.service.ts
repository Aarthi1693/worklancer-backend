import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LLMService } from './llm/llm.service';
import { PromptService } from './prompt/prompt.service';
import { SaveProjectPlanDto } from './dto/save-project-plan.dto';
import { UpdateProjectPlanDto } from './dto/update-project-plan.dto';
import { GenerateProjectPlanDto } from './dto/generate-project-plan.dto';
import { NotificationService } from '../notifications/notifications.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class AiService {
  constructor(
    private prisma: PrismaService,
    private llmService: LLMService,
    private promptService: PromptService,
    private notificationService: NotificationService,
  ) {}

  async generateProjectPlan(fields: GenerateProjectPlanDto): Promise<unknown> {
    if (fields.userId) {
      await this.notificationService.notify({
        userId: fields.userId,
        type: NotificationType.SYSTEM,
        title: 'AI Project Plan Generated',
        message: `AI Project Plan for "${fields.title}" has been generated.`,
      });
    }

    return {
      projectSummary: `The project "${fields.title}" is a ${fields.projectType} solution designed to deliver scalable and user-friendly functionality. The project focuses on quality, performance, and timely delivery.`,

      developmentRoadmap: [
        {
          phase: 'Requirement Analysis',
          description: 'Gather requirements and prepare project documentation.',
        },
        {
          phase: 'UI/UX Design',
          description: 'Design responsive wireframes and user interfaces.',
        },
        {
          phase: 'Frontend Development',
          description: 'Develop the application using React and Next.js.',
        },
        {
          phase: 'Backend Development',
          description: 'Develop APIs using NestJS and PostgreSQL.',
        },
        {
          phase: 'Testing & Deployment',
          description:
            'Perform testing, bug fixing, and production deployment.',
        },
      ],

      recommendedTeamRoles: [
        'Project Manager',
        'Frontend Developer',
        'Backend Developer',
        'UI/UX Designer',
        'QA Engineer',
      ],

      requiredSkills: [
        'React',
        'Next.js',
        'NestJS',
        'TypeScript',
        'PostgreSQL',
        'REST API',
        'Git',
      ],

      estimatedTimeline: '8-10 Weeks',

      riskAnalysis: [
        'Requirement changes may delay development.',
        'API integration issues.',
        'Testing delays.',
        'Deployment configuration risks.',
      ],

      recommendations: [
        'Follow Agile methodology.',
        'Conduct weekly sprint reviews.',
        'Perform regular code reviews.',
        'Maintain daily backups.',
        'Use CI/CD for deployment.',
      ],
    };
  }

  async saveProjectPlan(userId: string, body: SaveProjectPlanDto) {
    const plan = await this.prisma.aIProjectPlan.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        projectType: body.projectType,
        budget: body.budget ? Number(body.budget) : undefined,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
        requiredSkills: body.requiredSkills,
        teamSize: body.teamSize ? Number(body.teamSize) : undefined,
        priority: body.priority,
        planData: body.planData as Prisma.InputJsonValue,
        projectId: body.projectId,
        userId,
      },
    });

    await this.notificationService.notify({
      userId,
      type: NotificationType.SYSTEM,
      title: 'AI Project Plan Saved',
      message: `AI Project Plan "${body.title}" saved successfully.`,
    });

    return plan;
  }

  async getSavedPlans(userId: string) {
    return this.prisma.aIProjectPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSavedPlan(userId: string, id: string) {
    return this.prisma.aIProjectPlan.findFirst({
      where: { id, userId },
    });
  }

  async updateSavedPlan(
    userId: string,
    id: string,
    body: UpdateProjectPlanDto,
  ) {
    const existing = await this.prisma.aIProjectPlan.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new Error('Plan not found');
    }

    return this.prisma.aIProjectPlan.update({
      where: { id },
      data: {
        title: body.title,
        category: body.category,
        priority: body.priority,
      },
    });
  }

  async deleteSavedPlan(userId: string, id: string) {
    const existing = await this.prisma.aIProjectPlan.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new Error('Plan not found');
    }

    return this.prisma.aIProjectPlan.delete({
      where: { id },
    });
  }

  async recommendTeam(
    projectTitle: string,
    projectDescription: string,
    members: any[],
    userId?: string,
  ): Promise<unknown> {
    const prompt = `
You are an AI Team Recommendation Engine.

Project Title:
${projectTitle}

Project Description:
${projectDescription}

Available Professionals:

${JSON.stringify(members, null, 2)}

Analyze every professional and recommend the BEST team.

Return ONLY valid JSON.

{
  "summary": {
    "successRate": 95,
    "estimatedDays": 18,
    "recommendedMembers": 3,
    "estimatedCost": 75000
  },

  "members": [
    {
      "name": "",
      "role": "",
      "match": 98,
      "reason": "Why this professional was selected."
    }
  ],

  "riskAnalysis": [
    "Possible risk 1",
    "Possible risk 2"
  ]
}
`;

    const response = await this.llmService.generate(prompt);

    try {
      const result = JSON.parse(response);

      if (userId) {
        await this.notificationService.notify({
          userId,
          type: NotificationType.SYSTEM,
          title: 'Team Recommendation Ready',
          message: `AI Team Recommendation for "${projectTitle}" is ready.`,
        });
      }

      return result;
    } catch {
      return {
        success: false,
        rawResponse: response,
      };
    }
  }
}
