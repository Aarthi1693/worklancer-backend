import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MasterService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const activeProjects = await this.prisma.application.count();

    const completedProjects = await this.prisma.application.count({
      where: {
        status: 'ACCEPTED',
      },
    });

    const pendingProjects = await this.prisma.application.count({
      where: {
        status: 'PENDING',
      },
    });

    const applications = await this.prisma.application.findMany();

    const averageMatchScore =
      applications.length > 0
        ? applications.reduce((sum, app) => sum + app.matchScore, 0) /
          applications.length
        : 0;

    // Demo earnings calculation
    const earnings = completedProjects * 8500;

    return {
      activeProjects,
      completedProjects,
      pendingProjects,
      earnings,
      performance: Math.round(averageMatchScore),
    };
  }

  async getApplications() {
    return this.prisma.application.findMany({
      include: {
        project: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAvailableProjects() {
    return this.prisma.project.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
