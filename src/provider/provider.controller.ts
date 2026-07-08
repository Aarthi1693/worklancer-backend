import { Controller, Get } from '@nestjs/common';
import { ProviderService } from './provider.service';

@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Get('dashboard')
  getDashboard() {
    return this.providerService.getDashboardStats();
  }

  @Get('projects')
  getProjects() {
    return this.providerService.getProjects();
  }
}
