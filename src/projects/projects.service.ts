import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectStatus } from '@prisma/client';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  create(createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: createProjectDto,
    });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    return this.prisma.project.update({
      where: {
        id,
      },
      data: updateProjectDto,
    });
  }

  async remove(id: string) {
    return this.prisma.project.delete({
      where: {
        id,
      },
    });
  }

  findAll() {
    return this.prisma.project.findMany();
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
