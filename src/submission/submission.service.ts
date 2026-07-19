import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';

@Injectable()
export class SubmissionService {
  constructor(private prisma: PrismaService) {}

  async create(createSubmissionDto: CreateSubmissionDto) {
    const application = await this.prisma.application.findUnique({
      where: {
        id: createSubmissionDto.applicationId,
      },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    return this.prisma.submission.create({
      data: {
        applicationId: createSubmissionDto.applicationId,

        githubLink: createSubmissionDto.githubLink,

        deploymentLink: createSubmissionDto.deploymentLink,

        reportFile: createSubmissionDto.reportFile,

        imageUrls: createSubmissionDto.imageUrls,

        location: createSubmissionDto.location,

        completionDate: createSubmissionDto.completionDate
          ? new Date(createSubmissionDto.completionDate)
          : null,

        description: createSubmissionDto.description,
      },
    });
  }
  async findAll() {
    return this.prisma.submission.findMany({
      include: {
        application: {
          include: {
            user: true,
            project: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.submission.findUnique({
      where: {
        id,
      },
      include: {
        application: {
          include: {
            user: true,
            project: true,
          },
        },
      },
    });
  }
  async update(id: string, updateSubmissionDto: UpdateSubmissionDto) {
    const submission = await this.prisma.submission.update({
      where: {
        id,
      },
      data: {
        status: updateSubmissionDto.status,
      },
      include: {
        application: true,
      },
    });

    // If provider approves, automatically complete the project
    if (updateSubmissionDto.status === 'APPROVED') {
      await this.prisma.project.update({
        where: {
          id: submission.application.projectId,
        },
        data: {
          status: 'COMPLETED',
        },
      });
    }

    return submission;
  }

  async remove(id: string) {
    return this.prisma.submission.delete({
      where: {
        id,
      },
    });
  }
  async getAllSubmissions() {
    return this.prisma.submission.findMany({
      include: {
        application: {
          include: {
            user: true,
            project: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
