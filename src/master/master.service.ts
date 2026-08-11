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
    const currentTasks = await this.prisma.application.findMany({
      where: {
        status: 'ACCEPTED',
      },
      include: {
        project: true,
        user: true,
        submission: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

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
      currentTasks,
    };
  }

  async getApplications() {
    return this.prisma.application.findMany({
      where: {
        status: 'ACCEPTED',
      },
      include: {
        project: true,
        user: true,
        submission: true,
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

  async getMyTasks() {
  return this.prisma.application.findMany({
    where: {
      status: "ACCEPTED",
    },
    include: {
      user: true,

      submission: true,

      project: {
        include: {
          provider: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}
  async getAnalytics() {
    const acceptedTasks = await this.prisma.application.count({
      where: {
        status: 'ACCEPTED',
      },
    });

    const completedTasks = await this.prisma.submission.count({
      where: {
        status: 'APPROVED',
      },
    });

    const pendingReview = await this.prisma.submission.count({
      where: {
        status: 'PENDING',
      },
    });

    const rejected = await this.prisma.submission.count({
      where: {
        status: 'REJECTED',
      },
    });

    const earnings = completedTasks * 8500;

    const successRate =
      acceptedTasks === 0
        ? 0
        : Math.round((completedTasks / acceptedTasks) * 100);

    const base = successRate;

    const weeklyPerformance = [
      {
        day: 'Monday',
        value: Math.max(base - 18, 20),
      },
      {
        day: 'Tuesday',
        value: Math.max(base - 12, 30),
      },
      {
        day: 'Wednesday',
        value: Math.max(base - 8, 40),
      },
      {
        day: 'Thursday',
        value: Math.min(base + 2, 100),
      },
      {
        day: 'Friday',
        value: Math.min(base + 8, 100),
      },
      {
        day: 'Saturday',
        value: Math.min(base + 4, 100),
      },
      {
        day: 'Sunday',
        value: Math.min(base + 1, 100),
      },
    ];

    return {
      acceptedTasks,

      completedTasks,

      pendingReview,

      rejected,

      earnings,

      successRate,

      averageRating: 4.8,

      weeklyPerformance,

      monthlyGrowth: [
        { month: 'Jan', value: 3 },
        { month: 'Feb', value: 5 },
        { month: 'Mar', value: 7 },
        { month: 'Apr', value: 10 },
        { month: 'May', value: 12 },
        { month: 'Jun', value: completedTasks },
      ],

      skillDistribution: [
        {
          name: 'Frontend',
          value: 35,
        },
        {
          name: 'React',
          value: 25,
        },
        {
          name: 'UI Design',
          value: 20,
        },
        {
          name: 'AI',
          value: 20,
        },
      ],
    };
  }
}
