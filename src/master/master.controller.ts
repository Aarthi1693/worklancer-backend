import { Controller, Get } from '@nestjs/common';
import { MasterService } from './master.service';

@Controller('master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @Get('dashboard')
  getDashboard() {
    return this.masterService.getDashboardStats();
  }

  @Get('applications')
  getApplications() {
    return this.masterService.getApplications();
  }

  @Get('projects')
  getAvailableProjects() {
    return this.masterService.getAvailableProjects();
  }
  
  @Get("my-tasks")
  getMyTasks() {
  return this.masterService.getApplications();
   }
}
