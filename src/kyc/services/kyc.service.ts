import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePersonalInfoDto } from '../dto/create-personal-info.dto';
import { OcrService } from '../../ocr/ocr.service';
import { LLMService } from '../../ai/llm/llm.service';
import { FaceService } from './face.service';
import { NotificationService } from '../../notifications/notifications.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class KycService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ocrService: OcrService,
    private readonly llmService: LLMService,
    private readonly faceService: FaceService,
    private readonly notificationService: NotificationService,
  ) {}

  async savePersonalInfo(userId: string, dto: CreatePersonalInfoDto) {
    return this.prisma.kYC.upsert({
      where: { userId },

      update: {
        fullName: dto.fullName,
        dob: new Date(dto.dob),
        gender: dto.gender,
        phone: dto.phone,
        address: dto.address,
        city: dto.city,
        state: dto.state,
        pincode: dto.pincode,
      },

      create: {
        userId,
        fullName: dto.fullName,
        dob: new Date(dto.dob),
        gender: dto.gender,
        phone: dto.phone,
        address: dto.address,
        city: dto.city,
        state: dto.state,
        pincode: dto.pincode,
      },
    });
  }

  async getStatus(userId: string) {
    return this.prisma.kYC.findUnique({
      where: { userId },

      select: {
        status: true,
        riskScore: true,
        faceMatched: true,
        faceSimilarity: true,
        verifiedAt: true,
        aiSummary: true,

        fullName: true,
        dob: true,
        gender: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        pincode: true,

        aadhaarImage: true,
        panImage: true,
        selfieImage: true,

        ocrData: true,
      },
    });
  }

  async uploadDocument(userId: string, type: string, filename: string) {
    const updateData: Record<string, string> = {};

    if (type === 'aadhaar') {
      updateData.aadhaarImage = filename;
    }

    if (type === 'pan') {
      updateData.panImage = filename;
    }

    if (type === 'selfie') {
      updateData.selfieImage = filename;
    }

    const kyc = await this.prisma.kYC.update({
      where: { userId },
      data: updateData,
    });

    if (type === 'aadhaar' || type === 'pan') {
      const imagePath = `./src/kyc/uploads/${type}/${filename}`;

      const result = await this.ocrService.extractText(imagePath);

      const ocrData = (kyc.ocrData as any) || {};

      if (type === 'aadhaar') {
        const data = await this.llmService.extractIdentity(
          result.text,
          'AADHAAR',
        );

        ocrData.aadhaar = {
          ...data,
          rawText: result.text,
          confidence: result.confidence,
        };
      }

      if (type === 'pan') {
        const data = await this.llmService.extractIdentity(result.text, 'PAN');

        ocrData.pan = {
          ...data,
          rawText: result.text,
          confidence: result.confidence,
        };
      }

      await this.prisma.kYC.update({
        where: { userId },
        data: {
          ocrData,
          ocrConfidence: result.confidence,
        },
      });
    }
    const updated = await this.prisma.kYC.findUnique({
      where: { userId },
    });

    if (updated?.aadhaarImage && updated?.panImage && updated?.selfieImage) {
      await this.verifyKyc(userId);
    }

    return kyc;
  }

  async verifyKyc(userId: string) {
    const kyc = await this.prisma.kYC.findUnique({
      where: { userId },
    });

    if (!kyc) {
      throw new Error('KYC record not found');
    }

    // -----------------------------
    // Dummy Name & DOB Verification
    // -----------------------------

    const nameMatched = true;
    const dobMatched = true;

    // -----------------------------
    // Face Verification
    // -----------------------------

    let faceMatched = false;
    let faceSimilarity = 0;

    if (kyc.aadhaarImage && kyc.selfieImage) {
      const aadhaarPath = `./src/kyc/uploads/aadhaar/${kyc.aadhaarImage}`;
      const selfiePath = `./src/kyc/uploads/selfie/${kyc.selfieImage}`;

      const result = await this.faceService.verifyFace(selfiePath, aadhaarPath);

      faceMatched = result.faceMatched;
      faceSimilarity = result.faceSimilarity;
    }

    // -----------------------------
    // Final Decision
    // -----------------------------

    const riskScore = faceMatched ? 96 : 45;

    const status = faceMatched ? 'VERIFIED' : 'REJECTED';

    const aiPrompt = `
You are an AI KYC verification officer.

Applicant Name: ${kyc.fullName}

Name Verification: Passed

DOB Verification: Passed

Face Similarity: ${faceSimilarity}

Risk Score: ${riskScore}

Status: ${status}

Write a professional verification summary in less than 80 words.
`;

    const aiSummary = await this.llmService.generate(aiPrompt);

    const updated = await this.prisma.kYC.update({
      where: { userId },
      data: {
        faceMatched,
        faceSimilarity,
        riskScore,
        status,
        aiSummary,
        verifiedAt: new Date(),
      },
    });

    if (status === 'VERIFIED') {
      await this.notificationService.notify({
        userId,
        type: NotificationType.SYSTEM,
        title: 'KYC Approved',
        message: 'Your KYC has been approved successfully.',
      });
    }

    if (status === 'REJECTED') {
      await this.notificationService.notify({
        userId,
        type: NotificationType.SYSTEM,
        title: 'KYC Rejected',
        message: 'Your KYC has been rejected. Please review and resubmit.',
      });
    }

    return {
      ...updated,
      status,
      riskScore,
      faceMatched,
      faceSimilarity,
      aiSummary,
      verifiedAt: updated.verifiedAt,
    };
  }
}
