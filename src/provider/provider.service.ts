import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProviderService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const totalProjects = await this.prisma.project.count();

    const openProjects = await this.prisma.project.count({
      where: {
        status: 'OPEN',
      },
    });

    const inProgressProjects = await this.prisma.project.count({
      where: {
        status: 'IN_PROGRESS',
      },
    });

    const reviewProjects = await this.prisma.project.count({
      where: {
        status: 'REVIEW',
      },
    });

    const completedProjects = await this.prisma.project.count({
      where: {
        status: 'COMPLETED',
      },
    });

    const totalApplications =
      await this.prisma.application.count();

    return {
      totalProjects,
      openProjects,
      inProgressProjects,
      reviewProjects,
      completedProjects,
      totalApplications,
    };
  }

  async getProjects() {
    return this.prisma.project.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAssignedMasters(providerId: string) {
    const applications =
      await this.prisma.application.findMany({
        where: {
          status: 'ACCEPTED',
          project: {
            providerId,
          },
        },
        include: {
          user: true,
          project: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    return applications.map((app) => ({
      id: app.id,

      masterId: app.user.id,
      name: app.user.name,
      email: app.user.email,

      role: 'Master',

      rating: app.user.rating,

      experience: app.user.experience,

      skills: app.user.skills
        ? app.user.skills
            .split(',')
            .map((s) => s.trim())
        : [],

      projectId: app.project.id,

      project: app.project.title,

      status: app.project.status,

      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        app.user.name,
      )}&background=2563eb&color=ffffff`,
    }));
  }
}