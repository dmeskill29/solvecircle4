import { Prisma, User } from '@prisma/client';
import { prisma } from '../prisma';
import { ApiError } from '../api-utils';
import { hashPassword } from '../password-utils';

export class UserService {
  static async create(data: Omit<Prisma.UserCreateInput, 'password'> & { password: string }): Promise<User> {
    try {
      const hashedPassword = await hashPassword(data.password);
      return await prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ApiError('User with this email already exists', 400, 'USER_EXISTS');
        }
      }
      throw error;
    }
  }

  static async getById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
    }

    return user;
  }

  static async getByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  static async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    try {
      return await prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
        }
      }
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
        }
      }
      throw error;
    }
  }

  static async list(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<{ items: User[]; total: number }> {
    const { skip = 0, take = 10, where, orderBy } = params;

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take,
        where,
        orderBy,
      }),
      prisma.user.count({ where }),
    ]);

    return { items, total };
  }

  static async updatePassword(id: string, newPassword: string): Promise<void> {
    const hashedPassword = await hashPassword(newPassword);
    await this.update(id, { password: hashedPassword });
  }
} 