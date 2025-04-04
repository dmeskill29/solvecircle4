import { Prisma, Task } from '@prisma/client';
import { prisma } from '../prisma';
import { ApiError } from '../api-utils';

export class TaskService {
  static async create(data: Prisma.TaskCreateInput): Promise<Task> {
    try {
      return await prisma.task.create({ data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new ApiError('Referenced user does not exist', 400, 'INVALID_REFERENCE');
        }
      }
      throw error;
    }
  }

  static async getById(id: string): Promise<Task | null> {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        createdBy: true,
        assignedTo: true,
      },
    });

    if (!task) {
      throw new ApiError('Task not found', 404, 'TASK_NOT_FOUND');
    }

    return task;
  }

  static async update(id: string, data: Prisma.TaskUpdateInput): Promise<Task> {
    try {
      return await prisma.task.update({
        where: { id },
        data,
        include: {
          createdBy: true,
          assignedTo: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ApiError('Task not found', 404, 'TASK_NOT_FOUND');
        }
        if (error.code === 'P2003') {
          throw new ApiError('Referenced user does not exist', 400, 'INVALID_REFERENCE');
        }
      }
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await prisma.task.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ApiError('Task not found', 404, 'TASK_NOT_FOUND');
        }
      }
      throw error;
    }
  }

  static async list(params: {
    skip?: number;
    take?: number;
    where?: Prisma.TaskWhereInput;
    orderBy?: Prisma.TaskOrderByWithRelationInput;
  }): Promise<{ items: Task[]; total: number }> {
    const { skip = 0, take = 10, where, orderBy } = params;

    const [items, total] = await Promise.all([
      prisma.task.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          createdBy: true,
          assignedTo: true,
        },
      }),
      prisma.task.count({ where }),
    ]);

    return { items, total };
  }

  static async assignToUser(taskId: string, userId: string): Promise<Task> {
    return await this.update(taskId, {
      assignedTo: { connect: { id: userId } },
      status: 'IN_PROGRESS',
    });
  }

  static async unassignFromUser(taskId: string): Promise<Task> {
    return await this.update(taskId, {
      assignedTo: { disconnect: true },
      status: 'OPEN',
    });
  }

  static async updateStatus(taskId: string, status: Prisma.TaskUpdateInput['status']): Promise<Task> {
    return await this.update(taskId, { status });
  }
} 