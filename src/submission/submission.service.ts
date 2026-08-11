import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notifications/notifications.service';
import { PaymentsService } from '../payments/payments.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { NotificationType } from '@prisma/client';

@Injectable()
export class SubmissionService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
    private paymentsService: PaymentsService,
  ) {}

  async create(createSubmissionDto: CreateSubmissionDto) {
    const application = await this.prisma.application.findUnique({
      where: {
        id: createSubmissionDto.applicationId,
      },
      include: {
        project: true,
        user: true,
      },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    const submission = await this.prisma.submission.create({
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

    await this.notificationService.notify({
      userId: application.project.providerId,
      type: NotificationType.SUBMISSION,
      title: 'Work Submitted',
      message: `${application.user.name} submitted work for "${application.project.title}".`,
    });

    return submission;
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
      description: updateSubmissionDto.description,
      githubLink: updateSubmissionDto.githubLink,
      deploymentLink: updateSubmissionDto.deploymentLink,
      reportFile: updateSubmissionDto.reportFile,
      imageUrls: updateSubmissionDto.imageUrls,
      location: updateSubmissionDto.location,
      feedback: updateSubmissionDto.feedback,
      status: updateSubmissionDto.status,
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

  const projectTitle = submission.application.project.title;
  const masterId = submission.application.userId;

  if (updateSubmissionDto.status === 'APPROVED') {
    await this.notificationService.notify({
      userId: masterId,
      type: NotificationType.SUBMISSION,
      title: 'Submission Approved',
      message: `Your submitted work for "${projectTitle}" has been approved.`,
    });

    const existingPayment = await this.prisma.payment.findUnique({
      where: {
        submissionId: submission.id,
      },
    });

    if (!existingPayment) {
      await this.paymentsService.create({
        submissionId: submission.id,
        projectId: submission.application.project.id,
        providerId: submission.application.project.providerId,
        userId: submission.application.userId,
        amount: submission.application.project.budget,
      });
    }

    await this.prisma.project.update({
      where: {
        id: submission.application.project.id,
      },
      data: {
        status: 'REVIEW',
      },
    });
  }

  if (
    updateSubmissionDto.status === 'REJECTED' ||
    updateSubmissionDto.status === 'REVISION_REQUIRED'
  ) {
    await this.notificationService.notify({
      userId: masterId,
      type: NotificationType.SUBMISSION,
      title: 'Submission Needs Revision',
      message: `Your submission for "${projectTitle}" needs revisions.`,
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
