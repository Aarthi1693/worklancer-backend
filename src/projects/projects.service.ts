import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notifications/notifications.service';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

import { ProjectStatus, NotificationType } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const project = await this.prisma.project.create({
      data: {
        ...createProjectDto,
        providerId: createProjectDto.providerId!,
      },
    });

    // -----------------------------
    // CREATE NOTIFICATION
    // -----------------------------
    const masters = await this.prisma.user.findMany({
      where: {
        role: 'MASTER',
      },
      select: {
        id: true,
      },
    });

    for (const master of masters) {
      await this.notificationService.notify({
        userId: master.id,
        type: NotificationType.PROJECT,
        title: 'New Task Available',
        message: `"${project.title}" has been posted by a provider.`,
      });
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.prisma.project.update({
      where: {
        id,
      },
      data: updateProjectDto,
    });

    const applications = await this.prisma.application.findMany({
      where: {
        projectId: id,
      },
      select: {
        userId: true,
      },
    });

    for (const app of applications) {
      await this.notificationService.notify({
        userId: app.userId,
        type: NotificationType.PROJECT,
        title: 'Project Updated',
        message: `Project "${project.title}" has been updated.`,
      });
    }

    return project;
  }

  async remove(id: string) {
    const project = await this.prisma.project.findUnique({
      where: {
        id,
      },
      select: {
        title: true,
      },
    });

    const applications = await this.prisma.application.findMany({
      where: {
        projectId: id,
      },
      select: {
        userId: true,
      },
    });

    const deletedProject = await this.prisma.project.delete({
      where: {
        id,
      },
    });

    for (const app of applications) {
      await this.notificationService.notify({
        userId: app.userId,
        type: NotificationType.PROJECT,
        title: 'Project Removed',
        message: `Project "${project?.title || 'Unknown'}" has been removed by the provider.`,
      });
    }

    return deletedProject;
  }

  findAll() {
    return this.prisma.project.findMany();
  }

  async getProjectById(id: string) {
    const project = await this.prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        provider: true,
        applications: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async getProjectsByStatus(status: ProjectStatus) {
    return this.prisma.project.findMany({
      where: {
        status,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  getApplicants(projectId: string) {
    return this.prisma.application.findMany({
      where: {
        projectId,
      },
      include: {
        user: true,
        project: true,
      },
      orderBy: {
        matchScore: 'desc',
      },
    });
  }

  async getTopCandidate(projectId: string) {
    const topApplication = await this.prisma.application.findFirst({
      where: {
        projectId,
      },
      include: {
        user: true,
      },
      orderBy: {
        matchScore: 'desc',
      },
    });

    if (!topApplication) {
      return {
        message: 'No applications found',
      };
    }

    return {
      name: topApplication.user.name,
      email: topApplication.user.email,
      matchScore: topApplication.matchScore,
      skills: topApplication.user.skills,
      experience: topApplication.user.experience,
    };
  }

  async updateStatus(
    projectId: string,
    status: 'OPEN' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED',
  ) {
    return this.prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        status,
      },
    });
  }

  async getProjectHealth(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    const applications = await this.prisma.application.findMany({
      where: {
        projectId,
      },
    });

    const totalApplications = applications.length;

    const averageMatchScore =
      totalApplications > 0
        ? applications.reduce((sum, app) => sum + app.matchScore, 0) /
          totalApplications
        : 0;

    let health = 'LOW';

    if (averageMatchScore >= 70) {
      health = 'EXCELLENT';
    } else if (averageMatchScore >= 40) {
      health = 'GOOD';
    }

    return {
      project: project?.title,
      applications: totalApplications,
      averageMatchScore,
      health,
    };
  }
}
