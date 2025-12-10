import prisma from '../db/prismaClient';

export class ProgressService {
  async getUserProgress(userId: string) {
    // Get all attempts for the user
    const attempts = await prisma.attempt.findMany({
      where: { userId },
      include: {
        task: {
          include: {
            module: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (attempts.length === 0) {
      return {
        totalTasksCompleted: 0,
        uniqueTasksCompleted: 0,
        totalAttempts: 0,
        averageAccuracy: 0,
        averageScore: 0,
        lastActivityDate: null,
        moduleProgress: [],
        recentActivity: [],
      };
    }

    // Calculate unique tasks completed
    const uniqueTaskIds = new Set(attempts.map(a => a.taskId));
    const uniqueTasksCompleted = uniqueTaskIds.size;

    // Calculate overall statistics
    const totalAttempts = attempts.length;
    const totalScore = attempts.reduce((sum: number, a) => sum + a.score, 0);
    const totalAccuracy = attempts.reduce((sum: number, a) => sum + (a.accuracy || 0), 0);
    const averageScore = totalScore / totalAttempts;
    const averageAccuracy = totalAccuracy / totalAttempts;
    const lastActivityDate = attempts[0].createdAt;

    // Get all modules
    const modules = await prisma.module.findMany({
      include: {
        tasks: true,
      },
      orderBy: { order: 'asc' },
    });

    // Calculate progress for each module
    const moduleProgress = modules.map(module => {
      const moduleAttempts = attempts.filter(
        a => a.task.moduleId === module.id
      );

      const tasksInModule = module.tasks.length;
      const completedTasksInModule = new Set(
        moduleAttempts.map(a => a.taskId)
      ).size;

      const moduleAccuracy = moduleAttempts.length > 0
        ? moduleAttempts.reduce((sum: number, a) => sum + (a.accuracy || 0), 0) / moduleAttempts.length
        : 0;

      const moduleScore = moduleAttempts.length > 0
        ? moduleAttempts.reduce((sum: number, a) => sum + a.score, 0) / moduleAttempts.length
        : 0;

      return {
        moduleId: module.id,
        moduleTitle: module.title,
        moduleType: module.type,
        totalTasks: tasksInModule,
        completedTasks: completedTasksInModule,
        progressPercentage: tasksInModule > 0
          ? (completedTasksInModule / tasksInModule) * 100
          : 0,
        averageAccuracy: moduleAccuracy,
        averageScore: moduleScore,
        attemptsCount: moduleAttempts.length,
      };
    });

    // Get recent activity (last 10 attempts)
    const recentActivity = attempts.slice(0, 10).map(attempt => ({
      attemptId: attempt.id,
      taskId: attempt.task.id,
      taskTitle: attempt.task.title,
      taskType: attempt.task.type,
      moduleTitle: attempt.task.module.title,
      moduleType: attempt.task.module.type,
      score: attempt.score,
      accuracy: attempt.accuracy,
      reactionTime: attempt.reactionTime,
      completedAt: attempt.createdAt,
    }));

    // Calculate streak and consistency
    const streak = this.calculateStreak(attempts);

    return {
      totalTasksCompleted: uniqueTasksCompleted,
      uniqueTasksCompleted,
      totalAttempts,
      averageAccuracy,
      averageScore,
      lastActivityDate,
      streak,
      moduleProgress,
      recentActivity,
    };
  }

  async getModuleProgress(userId: string, moduleId: string) {
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        tasks: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!module) {
      return null;
    }

    const attempts = await prisma.attempt.findMany({
      where: {
        userId,
        task: {
          moduleId,
        },
      },
      include: {
        task: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate task-level progress
    const taskProgress = module.tasks.map(task => {
      const taskAttempts = attempts.filter(a => a.taskId === task.id);
      const bestAttempt = taskAttempts.length > 0
        ? taskAttempts.reduce((best, current) =>
            current.score > best.score ? current : best
          )
        : null;

      return {
        taskId: task.id,
        taskTitle: task.title,
        taskType: task.type,
        attemptsCount: taskAttempts.length,
        completed: taskAttempts.length > 0,
        bestScore: bestAttempt?.score || 0,
        bestAccuracy: bestAttempt?.accuracy || 0,
        lastAttemptDate: taskAttempts[0]?.createdAt || null,
      };
    });

    const completedTasks = taskProgress.filter(t => t.completed).length;
    const progressPercentage = module.tasks.length > 0
      ? (completedTasks / module.tasks.length) * 100
      : 0;

    return {
      module: {
        id: module.id,
        title: module.title,
        type: module.type,
        description: module.description,
      },
      totalTasks: module.tasks.length,
      completedTasks,
      progressPercentage,
      taskProgress,
    };
  }

  private calculateStreak(attempts: any[]): number {
    if (attempts.length === 0) return 0;

    // Sort attempts by date (oldest first for streak calculation)
    const sortedAttempts = [...attempts].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );

    let streak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedAttempts.length; i++) {
      const prevDate = new Date(sortedAttempts[i - 1].createdAt);
      const currDate = new Date(sortedAttempts[i].createdAt);

      // Set time to midnight for day comparison
      prevDate.setHours(0, 0, 0, 0);
      currDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor(
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 1) {
        currentStreak++;
        streak = Math.max(streak, currentStreak);
      } else if (daysDiff > 1) {
        currentStreak = 1;
      }
    }

    return streak;
  }
}
