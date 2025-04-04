import { Business, Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { ApiError } from '../api-utils';

export class BusinessService {
  static async create(data: Prisma.BusinessCreateInput): Promise<Business> {
    try {
      return await prisma.business.create({ data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ApiError('Business with this name already exists', 400, 'BUSINESS_EXISTS');
        }
      }
      throw error;
    }
  }

  static async getById(id: string): Promise<Business | null> {
    const business = await prisma.business.findUnique({
      where: { id },
    });

    if (!business) {
      throw new ApiError('Business not found', 404, 'BUSINESS_NOT_FOUND');
    }

    return business;
  }

  static async update(id: string, data: Prisma.BusinessUpdateInput): Promise<Business> {
    try {
      return await prisma.business.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ApiError('Business not found', 404, 'BUSINESS_NOT_FOUND');
        }
      }
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await prisma.business.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ApiError('Business not found', 404, 'BUSINESS_NOT_FOUND');
        }
      }
      throw error;
    }
  }

  static async list(params: {
    skip?: number;
    take?: number;
    where?: Prisma.BusinessWhereInput;
    orderBy?: Prisma.BusinessOrderByWithRelationInput;
  }): Promise<{ items: Business[]; total: number }> {
    const { skip = 0, take = 10, where, orderBy } = params;

    const [items, total] = await Promise.all([
      prisma.business.findMany({
        skip,
        take,
        where,
        orderBy,
      }),
      prisma.business.count({ where }),
    ]);

    return { items, total };
  }
} 