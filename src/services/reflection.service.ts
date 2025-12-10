import prisma from '../db/prismaClient';
import { CreateReflectionInput } from '../validators/reflection.validator';

export class ReflectionService {
  async createReflection(userId: string, data: CreateReflectionInput) {
    const reflection = await prisma.reflection.create({
      data: {
        userId,
        content: data.content,
        tags: data.tags || [],
      },
    });

    return reflection;
  }

  async getUserReflections(userId: string, options?: {
    limit?: number;
    offset?: number;
    tags?: string[];
  }) {
    const where: any = { userId };

    if (options?.tags && options.tags.length > 0) {
      where.tags = {
        hasSome: options.tags,
      };
    }

    const reflections = await prisma.reflection.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: options?.limit || 50,
      skip: options?.offset || 0,
    });

    const total = await prisma.reflection.count({ where });

    return {
      reflections,
      total,
      limit: options?.limit || 50,
      offset: options?.offset || 0,
    };
  }

  async getReflectionById(id: string, userId: string) {
    const reflection = await prisma.reflection.findFirst({
      where: {
        id,
        userId,
      },
    });

    return reflection;
  }

  async updateReflection(id: string, userId: string, data: Partial<CreateReflectionInput>) {
    const reflection = await prisma.reflection.updateMany({
      where: {
        id,
        userId,
      },
      data,
    });

    return reflection;
  }

  async deleteReflection(id: string, userId: string) {
    await prisma.reflection.deleteMany({
      where: {
        id,
        userId,
      },
    });

    return { message: 'Reflection deleted successfully' };
  }
}
