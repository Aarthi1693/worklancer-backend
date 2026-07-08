import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiService {
  private ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  async generate(prompt: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text ?? '';

      return text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
    } catch (error: unknown) {
      console.error('Gemini Error:', error);

      if (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        (error as { status: number }).status === 503
      ) {
        return JSON.stringify({
          success: false,
          message:
            'Gemini AI is temporarily busy. Please try again in a few moments.',
        });
      }

      return JSON.stringify({
        success: false,
        message: 'Failed to communicate with Gemini AI.',
      });
    }
  }
}
