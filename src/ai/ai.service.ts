import { Injectable } from '@nestjs/common';
import { GeminiService } from './gemini/gemini.service';
import { PromptService } from './prompt/prompt.service';

@Injectable()
export class AiService {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly promptService: PromptService,
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
