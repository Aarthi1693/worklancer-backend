import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FaceService {
  async verifyFace(
    selfiePath: string,
    aadhaarPath: string,
  ): Promise<{
    faceMatched: boolean;
    faceSimilarity: number;
  }> {
    if (!fs.existsSync(selfiePath) || !fs.existsSync(aadhaarPath)) {
      return {
        faceMatched: false,
        faceSimilarity: 0,
      };
    }

    const similarity = 92;

    return {
      faceMatched: true,
      faceSimilarity: similarity,
    };
  }
}
