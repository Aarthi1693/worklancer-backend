import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-applications.dto';
import { NotificationService } from '../notifications/notifications.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationService,
  ) {}

  async create(createApplicationDto: CreateApplicationDto) {
    try {
      console.log('Incoming DTO:', createApplicationDto);

      const user = (await this.prisma.user.findUnique({
        where: {
          id: createApplicationDto.userId,
        },
      })) as { name: string; skills: string | null } | null;

      console.log('User:', user);

      const project = (await this.prisma.project.findUnique({
        where: {
          id: createApplicationDto.projectId,
        },
      })) as {
        providerId: string;
        title: string;
        requiredSkills: string;
      } | null;

      console.log('Project:', project);

      if (!user || !project) {
        throw new Error('User or Project not found');
      }

      if (!project.providerId) {
        throw new Error('Project provider not found');
      }

      const userSkills =
        user.skills?.split(',').map((skill) => skill.trim().toLowerCase()) ||
        [];

      const requiredSkills = project.requiredSkills
        .split(',')
        .map((skill) => skill.trim().toLowerCase());

      const matchedSkills = requiredSkills.filter((skill) =>
        userSkills.includes(skill),
      );

      const matchScore = (matchedSkills.length / requiredSkills.length) * 100;

      const application = await this.prisma.application.create({
        data: {
          userId: createApplicationDto.userId,
          projectId: createApplicationDto.projectId,
          matchScore,
        },
      });

      await this.notifications.notify({
        userId: project.providerId,
        type: NotificationType.APPLICATION,
        title: 'New Application',
        message: `${user.name} applied to "${project.title}".`,
      });

      return application;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll() {
    return this.prisma.application.findMany({
      include: {
        user: true,
        project: true,
      },
    });
  }

  async accept(id: string) {
    const application = await this.prisma.application.update({
      where: {
        id,
      },
      data: {
        status: 'ACCEPTED',
      },
      include: {
        user: true,
        project: true,
      },
    });

    await this.notifications.notify({
      userId: application.userId,
      type: NotificationType.APPLICATION,
      title: 'Application Accepted',
      message: `Your application for "${application.project.title}" has been accepted.`,
    });

    return application;
  }

  async reject(id: string) {
    const application = await this.prisma.application.update({
      where: {
        id,
      },
      data: {
        status: 'REJECTED',
      },
      include: {
        user: true,
        project: true,
      },
    });

    await this.notifications.notify({
      userId: application.userId,
      type: NotificationType.APPLICATION,
      title: 'Application Rejected',
      message: `Your application for "${application.project.title}" has been rejected.`,
    });

    return application;
  }
}
