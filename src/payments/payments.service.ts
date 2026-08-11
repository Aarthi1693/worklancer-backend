import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notifications/notifications.service';
import { NotificationType, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  findBySubmissionId(submissionId: string) {
    return this.prisma.payment.findUnique({
      where: {
        submissionId,
      },
    });
  }

  async create(data: {
    submissionId: string;
    projectId: string;
    providerId: string;
    userId: string;
    amount: number;
  }) {
    const payment = await this.prisma.payment.create({
      data: {
        submissionId: data.submissionId,
        projectId: data.projectId,
        providerId: data.providerId,
        userId: data.userId,
        amount: data.amount,
        status: PaymentStatus.HELD,
      },
    });

    const project = await this.prisma.project.findUnique({
      where: { id: data.projectId },
      select: { title: true },
    });

    await this.notificationService.notify({
      userId: data.providerId,
      type: NotificationType.PAYMENT,
      title: 'Payment Created',
      message: `Payment has been created and placed in escrow for "${project?.title || 'Unknown'}".`,
    });

    await this.notificationService.notify({
      userId: data.userId,
      type: NotificationType.PAYMENT,
      title: 'Payment Created',
      message: `Payment has been created and placed in escrow for "${project?.title || 'Unknown'}".`,
    });

    return payment;
  }

  async findByProvider(providerId: string) {
    const payments = await this.prisma.payment.findMany({
      where: { providerId },
      orderBy: { createdAt: 'desc' },
    });

    const paymentsWithDetails = await Promise.all(
      payments.map(async (payment) => {
        const project = await this.prisma.project.findUnique({
          where: { id: payment.projectId },
          select: {
            id: true,
            title: true,
            taskType: true,
          },
        });
        const master = await this.prisma.user.findUnique({
          where: { id: payment.userId },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });
        const provider = await this.prisma.user.findUnique({
          where: { id: payment.providerId },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });
        return { ...payment, project, master, provider };
      }),
    );

    return paymentsWithDetails;
  }

  async findByMaster(masterId: string) {
    const payments = await this.prisma.payment.findMany({
      where: { userId: masterId },
      orderBy: { createdAt: 'desc' },
    });

    const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);
    const releasedEarnings = payments
      .filter((p) => p.status === PaymentStatus.RELEASED)
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingEarnings = payments
      .filter(
        (p) =>
          p.status === PaymentStatus.PENDING || p.status === PaymentStatus.HELD,
      )
      .reduce((sum, p) => sum + p.amount, 0);

    const paymentsWithDetails = await Promise.all(
      payments.map(async (payment) => {
        const project = await this.prisma.project.findUnique({
          where: { id: payment.projectId },
          select: {
            id: true,
            title: true,
            taskType: true,
          },
        });
        const master = await this.prisma.user.findUnique({
          where: { id: payment.userId },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });
        const provider = await this.prisma.user.findUnique({
          where: { id: payment.providerId },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });
        return { ...payment, project, master, provider };
      }),
    );

    return {
      totalEarnings,
      pendingEarnings,
      releasedEarnings,
      payments: paymentsWithDetails,
    };
  }

  async release(id: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id },
      });

      if (!payment) {
        throw new NotFoundException('Payment not found');
      }

      if (payment.providerId !== userId) {
        throw new Error('Not authorized to release this payment');
      }

      const updatedPayment = await tx.payment.update({
        where: { id },
        data: {
          status: PaymentStatus.RELEASED,
          releasedAt: new Date(),
        },
      });

      const project = await tx.project.findUnique({
        where: { id: payment.projectId },
        select: { title: true },
      });

      await tx.project.update({
        where: { id: payment.projectId },
        data: { status: 'COMPLETED' },
      });

      await this.notificationService.notify({
        userId: payment.providerId,
        type: NotificationType.PAYMENT,
        title: 'Payment Successfully Released',
        message: `Payment of ₹${payment.amount} has been released for project "${project?.title || 'Unknown'}".`,
        data: { paymentId: payment.id, projectId: payment.projectId },
      });

      await this.notificationService.notify({
        userId: payment.userId,
        type: NotificationType.PAYMENT,
        title: 'Payment Released',
        message: `Payment of ₹${payment.amount} has been released for project "${project?.title || 'Unknown'}".`,
        data: { paymentId: payment.id, projectId: payment.projectId },
      });

      return {
        success: true,
        payment: updatedPayment,
      };
    });
  }
}
