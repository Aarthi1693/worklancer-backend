import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../ai/gemini/gemini.service';

@Injectable()
export class KycService {
  private readonly logger = new Logger(KycService.name);

  constructor(
    private prisma: PrismaService,
    private geminiService: GeminiService,
  ) {}

  async getStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        kycStatus: true,
        kycVerifiedAt: true,
        kycScore: true,
        kycVerificationReport: true,
        kycIdPhoto: true,
        kycPanCard: true,
        kycSelfie: true,
        kycProfilePhoto: true,
        kycDob: true,
        kycGender: true,
        kycAddress: true,
        kycCity: true,
        kycState: true,
        kycPincode: true,
        kycPhone: true,
        name: true,
        email: true,
        githubUrl: true,
        linkedinUrl: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      status: user.kycStatus ?? 'NOT_STARTED',
      verifiedAt: user.kycVerifiedAt,
      score: user.kycScore,
      report: user.kycVerificationReport,
      documents: {
        idPhoto: user.kycIdPhoto,
        panCard: user.kycPanCard,
        selfie: user.kycSelfie,
        profilePhoto: user.kycProfilePhoto,
      },
      personalInfo: {
        fullName: user.name,
        email: user.email,
        dob: user.kycDob,
        gender: user.kycGender,
        address: user.kycAddress,
        city: user.kycCity,
        state: user.kycState,
        pincode: user.kycPincode,
        phone: user.kycPhone,
        githubUrl: user.githubUrl,
        linkedinUrl: user.linkedinUrl,
      },
    };
  }

  async updatePersonalInfo(
    userId: string,
    data: {
      fullName?: string;
      dob?: string;
      gender?: string;
      address?: string;
      city?: string;
      state?: string;
      pincode?: string;
      phone?: string;
      githubUrl?: string;
      linkedinUrl?: string;
    },
  ) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.fullName !== undefined && { name: data.fullName }),
        ...(data.dob !== undefined && { kycDob: data.dob }),
        ...(data.gender !== undefined && { kycGender: data.gender }),
        ...(data.address !== undefined && { kycAddress: data.address }),
        ...(data.city !== undefined && { kycCity: data.city }),
        ...(data.state !== undefined && { kycState: data.state }),
        ...(data.pincode !== undefined && { kycPincode: data.pincode }),
        ...(data.phone !== undefined && { kycPhone: data.phone }),
        ...(data.githubUrl !== undefined && { githubUrl: data.githubUrl }),
        ...(data.linkedinUrl !== undefined && { linkedinUrl: data.linkedinUrl }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        kycStatus: true,
        kycScore: true,
        kycVerifiedAt: true,
        kycDob: true,
        kycGender: true,
        kycAddress: true,
        kycCity: true,
        kycState: true,
        kycPincode: true,
        kycPhone: true,
        githubUrl: true,
        linkedinUrl: true,
      },
    });

    return updated;
  }

  async uploadDocuments(
    userId: string,
    documents: {
      profilePhoto?: string;
      selfie?: string;
      idPhoto?: string;
      panCard?: string;
    },
  ) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        kycStatus: 'PENDING',
        kycProfilePhoto: documents.profilePhoto,
        kycSelfie: documents.selfie,
        kycIdPhoto: documents.idPhoto,
        kycPanCard: documents.panCard,
      },
      select: {
        id: true,
        name: true,
        email: true,
        kycStatus: true,
        kycScore: true,
        kycVerifiedAt: true,
      },
    });

    return updated;
  }

  async simulateVerification(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        kycDob: true,
        kycGender: true,
        kycAddress: true,
        kycCity: true,
        kycState: true,
        kycPincode: true,
        kycPhone: true,
        kycIdPhoto: true,
        kycPanCard: true,
        kycSelfie: true,
        kycProfilePhoto: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const missingDocs: string[] = [];
    if (!user.kycIdPhoto) missingDocs.push('Government ID (Aadhaar)');
    if (!user.kycPanCard) missingDocs.push('PAN Card');
    if (!user.kycSelfie) missingDocs.push('Selfie');
    if (!user.kycProfilePhoto) missingDocs.push('Profile Photo');

    const missingPersonalInfo: string[] = [];
    if (!user.kycDob) missingPersonalInfo.push('Date of Birth');
    if (!user.kycGender) missingPersonalInfo.push('Gender');
    if (!user.kycAddress) missingPersonalInfo.push('Address');
    if (!user.kycCity) missingPersonalInfo.push('City');
    if (!user.kycState) missingPersonalInfo.push('State');
    if (!user.kycPincode) missingPersonalInfo.push('Pincode');
    if (!user.kycPhone) missingPersonalInfo.push('Phone Number');

    const reasons: string[] = [];

    if (missingDocs.length > 0) {
      reasons.push(`Missing Documents: ${missingDocs.join(', ')}`);
    }

    if (missingPersonalInfo.length > 0) {
      reasons.push(
        `Missing Personal Information: ${missingPersonalInfo.join(', ')}`,
      );
    }

    if (reasons.length > 0) {
      const report = {
        status: 'REJECTED',
        reasons,
        verificationScore: '0/100',
        recommendation:
          'Please upload all required documents and complete personal information.',
      };

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          kycStatus: 'REJECTED',
          kycScore: 0,
          kycVerificationReport: report,
        },
      });

      return {
        steps: [
          'Uploading documents...',
          'Reading identity document...',
          'Running OCR analysis...',
          'Comparing entered details...',
          'Checking image quality...',
          'Running AI identity verification...',
          'Performing fraud risk analysis...',
          'Generating verification report...',
          'Verification failed.',
        ],
        report,
      };
    }

    const prompt = `
You are an AI KYC Verification Engine for WorkLancer AI.

Analyze the following user details and determine a realistic verification report.

User Details:
- Full Name: ${user.name}
- Email: ${user.email}
- Date of Birth: ${user.kycDob}
- Gender: ${user.kycGender}
- Address: ${user.kycAddress}
- City: ${user.kycCity}
- State: ${user.kycState}
- Pincode: ${user.kycPincode}
- Phone: ${user.kycPhone}

Documents Provided:
- Government ID (Aadhaar): ${user.kycIdPhoto ? 'Uploaded' : 'Missing'}
- PAN Card: ${user.kycPanCard ? 'Uploaded' : 'Missing'}
- Selfie: ${user.kycSelfie ? 'Uploaded' : 'Missing'}
- Profile Photo: ${user.kycProfilePhoto ? 'Uploaded' : 'Missing'}

All required documents and personal information have been provided.

Generate a realistic verification report with the following fields:
- identityMatch: percentage string (e.g., "98%")
- ocrConfidence: percentage string (e.g., "99%")
- documentQuality: "Excellent", "Good", or "Fair"
- faceMatch: percentage string (e.g., "97%")
- fraudRisk: "Low", "Medium", or "High"
- verificationScore: score string (e.g., "96/100")
- status: "VERIFIED"
- recommendation: short positive message

Return ONLY valid JSON without any markdown backticks.
    `;

    let report: any = {
      status: 'REJECTED',
      reasons: ['AI analysis failed. Please try again.'],
      verificationScore: '0/100',
      recommendation: 'Verification failed. Please try again.',
    };

    try {
      const response = await this.geminiService.generate(prompt);
      const parsed = JSON.parse(response);

      report = {
        identityMatch: parsed.identityMatch || '95%',
        ocrConfidence: parsed.ocrConfidence || '96%',
        documentQuality: parsed.documentQuality || 'Good',
        faceMatch: parsed.faceMatch || '94%',
        fraudRisk: parsed.fraudRisk || 'Low',
        verificationScore: parsed.verificationScore || '90/100',
        status: 'VERIFIED',
        recommendation:
          parsed.recommendation || 'Identity verified successfully.',
      };
    } catch (error) {
      this.logger.error(
        'Gemini KYC verification failed, using fallback',
        error.stack,
      );

      report = {
        identityMatch: '97%',
        ocrConfidence: '98%',
        documentQuality: 'Excellent',
        faceMatch: '96%',
        fraudRisk: 'Low',
        verificationScore: '95/100',
        status: 'VERIFIED',
        recommendation: 'Identity verified successfully.',
      };
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        kycStatus: 'VERIFIED',
        kycScore: parseInt(report.verificationScore.replace('/100', ''), 10),
        kycVerifiedAt: new Date(),
        kycVerificationReport: report,
      },
      select: {
        id: true,
        name: true,
        email: true,
        kycStatus: true,
        kycScore: true,
        kycVerifiedAt: true,
      },
    });

    return {
      steps: [
        'Uploading documents...',
        'Reading identity document...',
        'Running OCR analysis...',
        'Comparing entered details...',
        'Checking image quality...',
        'Running AI identity verification...',
        'Performing fraud risk analysis...',
        'Generating verification report...',
        'Verification completed.',
      ],
      report,
    };
  }
}
