import prisma from '../db/prismaClient';
import { NotFoundError } from '../utils/errors';

export class ModuleService {
  async getAllModules() {
    const modules = await prisma.module.findMany({
      orderBy: { order: 'asc' },
      include: {
        tasks: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            description: true,
            type: true,
            order: true,
          },
        },
      },
    });

    return modules;
  }

  async getModuleById(id: string) {
    const module = await prisma.module.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!module) {
      throw new NotFoundError('Module not found');
    }

    return module;
  }

  async createModule(data: {
    title: string;
    description: string;
    type: string;
    order: number;
  }) {
    const module = await prisma.module.create({
      data: data as any,
    });

    return module;
  }

  async updateModule(id: string, data: Partial<{
    title: string;
    description: string;
    type: string;
    order: number;
  }>) {
    const module = await prisma.module.update({
      where: { id },
      data: data as any,
    });

    return module;
  }

  async deleteModule(id: string) {
    await prisma.module.delete({
      where: { id },
    });

    return { message: 'Module deleted successfully' };
  }
}
