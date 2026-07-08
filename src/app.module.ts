import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { ApplicationsModule } from './applications/applications.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProviderModule } from './provider/provider.module';
import { MasterModule } from './master/master.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ProjectsModule,
    ApplicationsModule,
    DashboardModule,
    ProviderModule,
    MasterModule,
    AiModule,
  ],
})
export class AppModule {}
