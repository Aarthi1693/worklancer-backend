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

    const totalApplications = await this.prisma.application.count();

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
}
