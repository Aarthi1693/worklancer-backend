import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../ai/gemini/gemini.service';

@Injectable()
export class CareerAiService {
  constructor(
    private prisma: PrismaService,
    private geminiService: GeminiService,
  ) {}

  async analyzeCareer(userId: string) {

    const user = await this.prisma.user.findUnique({
  where: { id: userId },
  include: {
    applications: true,
  },
});
    if (!user) {
      throw new Error("User not found");
    }

    const prompt = `
You are an AI Career Mentor.

Analyze this software professional.

Name:
${user.name}

Skills:
${user.skills}

Experience:
${user.experience} years

Rating:
${user.rating}

Role:
${user.role}

Return ONLY JSON.

{
  "careerScore": 90,
  "marketDemand": 95,
  "salaryPrediction":{
      "current":"₹8 LPA",
      "future":"₹16 LPA"
  },
  "strongSkills":[
      "",
      "",
      ""
  ],
  "skillsToImprove":[
      "",
      "",
      ""
  ],
  "roadmap":[
      "",
      "",
      "",
      ""
  ],
  "report":"",
  "suggestions":[
      "",
      "",
      ""
  ]
}
`;

    const response =
      await this.geminiService.generate(prompt);

    try {
      return JSON.parse(response);
    } catch {
      return {
        rawResponse: response,
      };
    }
  }
}
