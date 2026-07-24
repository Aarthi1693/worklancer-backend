import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { ApplicationsModule } from './applications/applications.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProviderModule } from './provider/provider.module';
import { MasterModule } from './master/master.module';
import { AiModule } from './ai/ai.module';
import { SubmissionModule } from './submission/submission.module';
import { CareerAiModule } from './career-ai/career-ai.module';
import { ChatModule } from './chat/chat.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';
import { KycModule } from './kyc/kyc.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: 20,
      },
    ]),
    PrismaModule,
    UsersModule,
    AuthModule,
    ProjectsModule,
    ApplicationsModule,
    DashboardModule,
    ProviderModule,
    MasterModule,
    AiModule,
    SubmissionModule,
    CareerAiModule,
    ChatModule,
    NotificationsModule,
    PaymentsModule,
    KycModule,
  ],
})
export class AppModule {}
