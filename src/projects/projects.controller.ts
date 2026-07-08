import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProjectStatus } from '@prisma/client';

import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  // ✅ Update Project
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
remove(@Param('id') id: string) {
  return this.projectsService.remove(id);
}

  @Get('status/:status')
  getProjectsByStatus(@Param('status') status: ProjectStatus) {
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
