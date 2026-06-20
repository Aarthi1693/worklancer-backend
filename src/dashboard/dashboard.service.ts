import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const totalProjects = await this.prisma.project.count();

    const totalApplications = await this.prisma.application.count();

    const applications = await this.prisma.application.findMany({
      include: {
        user: true,
      },
    });

    const averageMatchScore =
      applications.length > 0
        ? applications.reduce((sum, app) => sum + app.matchScore, 0) /
          applications.length
        : 0;

    const topApplication = applications.sort(
      (a, b) => b.matchScore - a.matchScore,
    )[0];

    return {
      totalProjects,
      totalApplications,
      averageMatchScore,
      topCandidate: topApplication?.user?.name || 'No Applications',
    };
  }
}
