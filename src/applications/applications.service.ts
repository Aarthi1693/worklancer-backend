import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-applications.dto';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(createApplicationDto: CreateApplicationDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: createApplicationDto.userId,
      },
    });

    const project = await this.prisma.project.findUnique({
      where: {
        id: createApplicationDto.projectId,
      },
    });

    if (!user || !project) {
      throw new Error('User or Project not found');
    }

    const userSkills =
      user.skills?.split(',').map((skill) => skill.trim().toLowerCase()) || [];

    const requiredSkills = project.requiredSkills
      .split(',')
      .map((skill) => skill.trim().toLowerCase());

    const matchedSkills = requiredSkills.filter((skill) =>
      userSkills.includes(skill),
    );

    const matchScore = (matchedSkills.length / requiredSkills.length) * 100;

    return this.prisma.application.create({
      data: {
        userId: createApplicationDto.userId,
        projectId: createApplicationDto.projectId,
        matchScore,
      },
    });
  }

  async findAll() {
    return this.prisma.application.findMany({
      include: {
        user: true,
        project: true,
      },
    });
  }
}
