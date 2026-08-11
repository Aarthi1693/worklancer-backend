import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Req,
  UseGuards,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectStatus } from '@prisma/client';
import type { Request } from 'express';

import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: Request, @Body() createProjectDto: CreateProjectDto) {
    const user = req.user as Record<string, unknown> | undefined;

    const userId = typeof user?.id === 'string' ? user.id : undefined;
    const userRole = typeof user?.role === 'string' ? user.role : undefined;

    if (!userId) {
      throw new UnauthorizedException('Authentication required');
    }

    if (userRole !== 'PROVIDER') {
      throw new ForbiddenException('Only providers can create tasks');
    }

    return this.projectsService.create({
      ...createProjectDto,
      providerId: userId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  async getProjectById(@Param('id') id: string) {
    return this.projectsService.getProjectById(id);
  }

  // ✅ Update Project
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
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
  updateStatus(@Param('id') id: string, @Body() body: UpdateProjectStatusDto) {
    return this.projectsService.updateStatus(id, body.status);
  }

  @Get(':id/health')
  getProjectHealth(@Param('id') id: string) {
    return this.projectsService.getProjectHealth(id);
  }
}
