import { Module } from '@nestjs/common';
import { MasterProfileController } from './master-profile.controller';
import { ProfileModule } from '../profile/profile.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ProfileModule, AuthModule],
  controllers: [MasterProfileController],
})
export class MasterProfileModule {}
