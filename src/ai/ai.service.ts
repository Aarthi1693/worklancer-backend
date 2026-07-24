import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GeminiService } from './gemini/gemini.service';
import { PromptService } from './prompt/prompt.service';
import { PrismaService } from '../prisma/prisma.service';
import { SaveProjectPlanDto } from './dto/save-project-plan.dto';

@Injectable()
export class AiService {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly promptService: PromptService,
    private readonly prisma: PrismaService,
  ) {}

  // -----------------------------
  // AI Project Planner
  // -----------------------------
  async generateProjectPlan(title: string): Promise<unknown> {
    const prompt = this.promptService.generateProjectPlanPrompt(title);

    const response = await this.geminiService.generate(prompt);

    try {
      return JSON.parse(response);
    } catch {
      return {
        success: false,
        rawResponse: response,
      };
    }
  }

  async saveProjectPlan(userId: string, body: SaveProjectPlanDto) {
    return this.prisma.aIProjectPlan.create({
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
  }

  // -----------------------------
  // AI Team Recommendation
  // -----------------------------
  async recommendTeam(
    projectTitle: string,
    projectDescription: string,
    members: any[],
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

    const response = await this.geminiService.generate(prompt);

    try {
      return JSON.parse(response);
    } catch {
      return {
        success: false,
        rawResponse: response,
      };
    }
  }
}
