import { prisma } from "./prisma";
import { Business, User } from "@prisma/client";
import { generateBusinessCode } from "@/lib/utils";

export type BusinessWithRelations = Business & {
  owner: User;
  employees: User[];
};

export async function getBusinessById(id: string): Promise<BusinessWithRelations | null> {
  try {
    return await prisma.business.findUnique({
      where: { id },
      include: {
        owner: true,
        employees: true,
      },
    });
  } catch (error) {
    console.error("Error fetching business:", error);
    return null;
  }
}

export async function createBusiness(name: string, userId: string): Promise<Business | null> {
  try {
    // Generate a unique business code
    let businessCode = generateBusinessCode();
    let isCodeUnique = false;
    while (!isCodeUnique) {
      const existingBusiness = await prisma.business.findUnique({
        where: { code: businessCode },
      });
      if (!existingBusiness) {
        isCodeUnique = true;
      } else {
        businessCode = generateBusinessCode();
      }
    }

    // Create business and connect user as owner and employee
    return await prisma.business.create({
      data: {
        name,
        code: businessCode,
        owner: {
          connect: { id: userId },
        },
        employees: {
          connect: { id: userId },
        },
      },
    });
  } catch (error) {
    console.error("Error creating business:", error);
    return null;
  }
}

export async function joinBusiness(code: string, userId: string): Promise<Business | null> {
  try {
    const business = await prisma.business.findUnique({
      where: { code },
    });

    if (!business) {
      return null;
    }

    // Add user to business employees
    await prisma.user.update({
      where: { id: userId },
      data: {
        businessId: business.id,
      },
    });

    return business;
  } catch (error) {
    console.error("Error joining business:", error);
    return null;
  }
}

export async function getUserBusiness(userId: string): Promise<BusinessWithRelations | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        business: {
          include: {
            owner: true,
            employees: true,
          },
        },
      },
    });

    return user?.business || null;
  } catch (error) {
    console.error("Error fetching user business:", error);
    return null;
  }
} 