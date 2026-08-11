import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { HttpException } from '@nestjs/common';

@Injectable()
export class GeminiService {
  private ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  async generate(prompt: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
        contents: prompt,
      });

      const text = response.text ?? '';

      return text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
    } catch (error: unknown) {
      const status =
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        typeof (error as { status?: unknown }).status === 'number'
          ? (error as { status: number }).status
          : 500;

      if (status === 503) {
        throw new HttpException(
          'Gemini AI is temporarily busy. Please try again in a few moments.',
          503,
        );
      }

      if (status === 429) {
        throw new HttpException(
          'Gemini AI rate limit reached. Please try again shortly.',
          429,
        );
      }

      throw new HttpException('Failed to communicate with Gemini AI.', status);
    }
  }
}
