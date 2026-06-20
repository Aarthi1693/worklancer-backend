import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async getRecommendations(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const projects = await this.prisma.project.findMany();

    const userSkills =
      user.skills?.split(',').map((s) => s.trim().toLowerCase()) || [];

    const recommendations = projects.map((project) => {
      const requiredSkills = project.requiredSkills
        .split(',')
        .map((s) => s.trim().toLowerCase());

      const matchedSkills = requiredSkills.filter((skill) =>
        userSkills.includes(skill),
      );

      const matchScore = (matchedSkills.length / requiredSkills.length) * 100;

      return {
        projectId: project.id,
        title: project.title,
        matchScore,
      };
    });

    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  }
}
