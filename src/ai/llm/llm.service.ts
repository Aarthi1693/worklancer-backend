import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';

@Injectable()
export class LLMService {
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    this.model =
      this.configService.get<string>('GROQ_MODEL') ?? 'llama-3.3-70b-versatile';
  }

  async generate(prompt: string): Promise<string> {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');

    if (!apiKey) {
      throw new Error('GROQ_API_KEY is missing');
    }

    const groq = new Groq({
      apiKey,
    });

    const completion = await groq.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content ?? '';
  }

  async extractIdentity(text: string, type: 'AADHAAR' | 'PAN'): Promise<any> {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');

    if (!apiKey) {
      throw new Error('GROQ_API_KEY is missing');
    }

    const groq = new Groq({
      apiKey,
    });

    const prompt = `
You are an OCR correction AI.

The following text was extracted using OCR from an Indian ${type} card.

Correct OCR mistakes and extract only the required information.

Return ONLY valid JSON.

If the document is Aadhaar, return:

{
  "name": "",
  "dob": "",
  "gender": "",
  "aadhaarNumber": ""
}

If the document is PAN, return:

{
  "name": "",
  "dob": "",
  "panNumber": ""
}

OCR TEXT:

${text}
`;

    const completion = await groq.chat.completions.create({
      model: this.model,
      temperature: 0,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const response = completion.choices[0]?.message?.content ?? '{}';

    const cleaned = response
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      return {};
    }
  }
}
