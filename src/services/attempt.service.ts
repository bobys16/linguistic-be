import prisma from '../db/prismaClient';
import { NotFoundError } from '../utils/errors';
import { ScoringService } from './scoring.service';
import { CreateAttemptInput } from '../validators/attempt.validator';

const scoringService = new ScoringService();

export class AttemptService {
  async createAttempt(userId: string, data: CreateAttemptInput) {
    // Get task to access its type and config
    const task = await prisma.task.findUnique({
      where: { id: data.taskId },
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    // Calculate score based on task type
    const scoringResult = scoringService.calculateScore(
      task.type,
      data.response,
      task.config
    );

    // Create attempt
    const attempt = await prisma.attempt.create({
      data: {
        userId,
        taskId: data.taskId,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        response: data.response,
        score: scoringResult.score,
        accuracy: scoringResult.accuracy,
        reactionTime: scoringResult.reactionTime,
        metadata: scoringResult.metadata,
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
    });

    return attempt;
  }

  async getLatestAttempts(userId: string, limit = 10) {
    const attempts = await prisma.attempt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        task: {
          select: {
            id: true,
            title: true,
            type: true,
            module: {
              select: {
                id: true,
                title: true,
                type: true,
              },
            },
          },
        },
      },
    });

    return attempts;
  }

  async getAttemptSummary(userId: string) {
    const attempts = await prisma.attempt.findMany({
      where: { userId },
      select: {
        id: true,
        taskId: true,
        score: true,
        accuracy: true,
        reactionTime: true,
        createdAt: true,
        task: {
          select: {
            type: true,
            module: {
              select: {
                type: true,
              },
            },
          },
        },
      },
    });

    if (attempts.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        averageAccuracy: 0,
        averageReactionTime: 0,
        byModule: {},
        byTaskType: {},
      };
    }

    // Calculate overall statistics
    const totalAttempts = attempts.length;
    const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
    const totalAccuracy = attempts.reduce((sum, a) => sum + (a.accuracy || 0), 0);
    const attemptsWithReactionTime = attempts.filter(a => a.reactionTime !== null);
    const totalReactionTime = attemptsWithReactionTime.reduce(
      (sum, a) => sum + (a.reactionTime || 0),
      0
    );

    // Group by module type
    const byModule: Record<string, any> = {};
    attempts.forEach(attempt => {
      const moduleType = attempt.task.module.type;
      if (!byModule[moduleType]) {
        byModule[moduleType] = {
          count: 0,
          totalScore: 0,
          totalAccuracy: 0,
        };
      }
      byModule[moduleType].count++;
      byModule[moduleType].totalScore += attempt.score;
      byModule[moduleType].totalAccuracy += attempt.accuracy || 0;
    });

    // Calculate averages for each module
    Object.keys(byModule).forEach(moduleType => {
      const module = byModule[moduleType];
      module.averageScore = module.totalScore / module.count;
      module.averageAccuracy = module.totalAccuracy / module.count;
    });

    // Group by task type
    const byTaskType: Record<string, any> = {};
    attempts.forEach(attempt => {
      const taskType = attempt.task.type;
      if (!byTaskType[taskType]) {
        byTaskType[taskType] = {
          count: 0,
          totalScore: 0,
          totalAccuracy: 0,
        };
      }
      byTaskType[taskType].count++;
      byTaskType[taskType].totalScore += attempt.score;
      byTaskType[taskType].totalAccuracy += attempt.accuracy || 0;
    });

    // Calculate averages for each task type
    Object.keys(byTaskType).forEach(taskType => {
      const task = byTaskType[taskType];
      task.averageScore = task.totalScore / task.count;
      task.averageAccuracy = task.totalAccuracy / task.count;
    });

    return {
      totalAttempts,
      averageScore: totalScore / totalAttempts,
      averageAccuracy: totalAccuracy / totalAttempts,
      averageReactionTime: attemptsWithReactionTime.length > 0
        ? totalReactionTime / attemptsWithReactionTime.length
        : 0,
      byModule,
      byTaskType,
    };
  }

  async getAttemptsByTaskId(userId: string, taskId: string) {
    const attempts = await prisma.attempt.findMany({
      where: {
        userId,
        taskId,
      },
      orderBy: { createdAt: 'desc' },
    });

    return attempts;
  }
}
