import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
} from '@nestjs/common';
import { ProjectStatus } from '@prisma/client';

import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get('status/:status')
  getProjectsByStatus(
    @Param('status') status: ProjectStatus,
  ) {
    return this.projectsService.getProjectsByStatus(status);
  }

  @Get(':id/applicants')
  getApplicants(@Param('id') id: string) {
    return this.projectsService.getApplicants(id);
  }

  @Get(':id/top-candidate')
  getTopCandidate(@Param('id') id: string) {
    return this.projectsService.getTopCandidate(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateProjectStatusDto,
  ) {
    return this.projectsService.updateStatus(id, body.status);
  }

  @Get(':id/health')
  getProjectHealth(@Param('id') id: string) {
    return this.projectsService.getProjectHealth(id);
  }
}
