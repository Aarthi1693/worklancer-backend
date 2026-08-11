import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

export interface ProviderStats {
  projectsPosted: number;
  activeProjects: number;
  completedProjects: number;
  totalBudget: number;
  totalPayments: number;
  averageRating: number;
}

export interface MasterStats {
  completedProjects: number;
  activeProjects: number;
  successRate: number;
  totalEarnings: number;
  aiCareerScore: number | null;
  overallRating: number;
}

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        bio: true,
        location: true,
        companyName: true,
        providerType: true,
        industry: true,
        website: true,
        businessAddress: true,
        companyDescription: true,
        contactPerson: true,
        companySize: true,
        portfolioLink: true,
        linkedinUrl: true,
        githubUrl: true,
        skills: true,
        experience: true,
        rating: true,
        hourlyRate: true,
        availability: true,
        avatar: true,
        resume: true,
        gstNumber: true,
        companyRegistrationNumber: true,
        preferredRole: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      ...user,
      skills: user.skills ? user.skills.split(',').map((s) => s.trim()) : [],
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const data: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(updateProfileDto)) {
      if (value === undefined || value === null) continue;
      data[key] = value;
    }

    if (data.skills) {
      if (Array.isArray(data.skills)) {
        data.skills = data.skills
          .filter((s: string) => typeof s === 'string' && s.trim().length > 0)
          .map((s: string) => s.trim())
          .join(',');
      } else if (typeof data.skills === 'string') {
        data.skills = data.skills
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0)
          .join(',');
      }
    }

    if (data.experience !== undefined && data.experience !== null) {
      data.experience = Number(data.experience);
    }

    if (data.hourlyRate !== undefined && data.hourlyRate !== null) {
      data.hourlyRate = Number(data.hourlyRate);
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        bio: true,
        location: true,
        companyName: true,
        providerType: true,
        industry: true,
        website: true,
        businessAddress: true,
        companyDescription: true,
        contactPerson: true,
        companySize: true,
        portfolioLink: true,
        linkedinUrl: true,
        githubUrl: true,
        skills: true,
        experience: true,
        rating: true,
        hourlyRate: true,
        availability: true,
        avatar: true,
        resume: true,
        gstNumber: true,
        companyRegistrationNumber: true,
        preferredRole: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ...updated,
      skills: updated.skills
        ? updated.skills.split(',').map((s: string) => s.trim())
        : [],
    };
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      select: {
        avatar: true,
      },
    });

    return { avatarUrl: updated.avatar };
  }

  async updateResume(userId: string, resumeUrl: string) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { resume: resumeUrl },
      select: {
        resume: true,
      },
    });

    return { resumeUrl: updated.resume };
  }

  async getProviderStats(userId: string): Promise<ProviderStats> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { rating: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [
      projectsPosted,
      activeProjects,
      completedProjects,
      totalBudget,
      totalPayments,
    ] = await Promise.all([
      this.prisma.project.count({ where: { providerId: userId } }),
      this.prisma.project.count({
        where: {
          providerId: userId,
          status: { in: ['OPEN', 'IN_PROGRESS', 'REVIEW'] },
        },
      }),
      this.prisma.project.count({
        where: { providerId: userId, status: 'COMPLETED' },
      }),
      this.prisma.project.aggregate({
        where: { providerId: userId },
        _sum: { budget: true },
      }),
      this.prisma.payment.aggregate({
        where: { providerId: userId, status: 'RELEASED' },
        _sum: { amount: true },
      }),
    ]);

    return {
      projectsPosted,
      activeProjects,
      completedProjects,
      totalBudget: totalBudget._sum.budget || 0,
      totalPayments: totalPayments._sum.amount || 0,
      averageRating: user.rating || 0,
    };
  }

  async getMasterStats(userId: string): Promise<MasterStats> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        kyc: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const applications = await this.prisma.application.findMany({
      where: { userId },
      include: { project: true, submission: true },
    });

    const activeProjects = applications.filter(
      (app) => app.status === 'PENDING' || app.status === 'ACCEPTED',
    ).length;

    const acceptedTasks = applications.filter(
      (app) => app.status === 'ACCEPTED',
    ).length;
    const completedProjects = applications.filter(
      (app) => app.submission?.status === 'APPROVED',
    ).length;

    const successRate =
      acceptedTasks === 0
        ? 0
        : Math.round((completedProjects / acceptedTasks) * 100);

    const totalEarnings = applications
      .filter((app) => app.submission?.status === 'APPROVED')
      .reduce((sum, app) => sum + app.project.budget, 0);

    return {
      completedProjects,
      activeProjects,
      successRate,
      totalEarnings,
      aiCareerScore: user.kyc?.riskScore ?? null,
      overallRating: user.rating || 0,
    };
  }
}
