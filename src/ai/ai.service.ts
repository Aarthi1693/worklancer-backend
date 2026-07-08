import { Injectable } from '@nestjs/common';
import { GeminiService } from './gemini/gemini.service';
import { PromptService } from './prompt/prompt.service';

@Injectable()
export class AiService {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly promptService: PromptService,
  ) {}

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
}
