import { Module } from '@nestjs/common';
import { ProviderProfileController } from './provider-profile.controller';
import { ProfileModule } from '../profile/profile.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ProfileModule, AuthModule],
  controllers: [ProviderProfileController],
})
export class ProviderProfileModule {}
