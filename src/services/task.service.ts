import prisma from '../db/prismaClient';
import { NotFoundError } from '../utils/errors';

export class TaskService {
  /**
   * Remove answer keys from task config to prevent cheating
   */
  private sanitizeTaskConfig(task: any) {
    if (!task || !task.config) return task;

    const sanitizedConfig = { ...task.config };

    // Remove correct answers based on task type
    switch (task.type) {
      case 'DIGIT_SPAN':
      case 'READING_SPAN':
        delete sanitizedConfig.correctSequence;
        break;
      
      case 'LEXICAL_DECISION':
        if (sanitizedConfig.words) {
          sanitizedConfig.words = sanitizedConfig.words.map((w: any) => ({
            word: w.word,
            // Remove isWord field
          }));
        }
        break;
      
      case 'SENTENCE_VERIFICATION':
        if (sanitizedConfig.sentences) {
          sanitizedConfig.sentences = sanitizedConfig.sentences.map((s: any) => ({
            sentence: s.sentence,
            // Remove isCorrect field
          }));
        }
        break;
      
      case 'FORM_MEANING_MAPPING':
        if (sanitizedConfig.mappings) {
          sanitizedConfig.mappings = sanitizedConfig.mappings.map((m: any) => ({
            form: m.form,
            options: m.options,
            // Remove correctMeaning field
          }));
        }
        break;
      
      case 'ERROR_CORRECTION':
        if (sanitizedConfig.sentences) {
          sanitizedConfig.sentences = sanitizedConfig.sentences.map((s: any) => ({
            sentence: s.sentence,
            // Remove hasError and correction fields
          }));
        }
        break;
      
      // Reflection tasks don't have answers to hide
      case 'GUIDED_REFLECTION':
      case 'FREE_REFLECTION':
      default:
        break;
    }

    return { ...task, config: sanitizedConfig };
  }

  async getTaskById(id: string) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        module: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    return this.sanitizeTaskConfig(task);
  }

  async getTasksByModuleId(moduleId: string) {
    const tasks = await prisma.task.findMany({
      where: { moduleId },
      orderBy: { order: 'asc' },
    });

    return tasks.map(task => this.sanitizeTaskConfig(task));
  }

  async createTask(data: {
    moduleId: string;
    title: string;
    description: string;
    type: string;
    instructions: string;
    config: any;
    order: number;
  }) {
    const task = await prisma.task.create({
      data: data as any,
    });

    return task;
  }

  async updateTask(id: string, data: Partial<{
    title: string;
    description: string;
    type: string;
    instructions: string;
    config: any;
    order: number;
  }>) {
    const task = await prisma.task.update({
      where: { id },
      data: data as any,
    });

    return this.sanitizeTaskConfig(task);
  }

  async deleteTask(id: string) {
    await prisma.task.delete({
      where: { id },
    });

    return { message: 'Task deleted successfully' };
  }
}
