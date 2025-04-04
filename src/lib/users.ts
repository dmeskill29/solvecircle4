import { prisma } from "./prisma";
import { User, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

export type UserWithBusiness = User & {
  business: {
    id: string;
    name: string;
    code: string;
  } | null;
};

export async function getUserById(id: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<User | null> {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "EMPLOYEE",
        points: 0,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

export async function updateUserRole(userId: string, role: UserRole): Promise<User | null> {
  try {
    return await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return null;
  }
}

export async function getUserWithBusiness(userId: string): Promise<UserWithBusiness | null> {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user with business:", error);
    return null;
  }
}

export async function updateUserPoints(userId: string, points: number): Promise<User | null> {
  try {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        points: {
          increment: points,
        },
      },
    });
  } catch (error) {
    console.error("Error updating user points:", error);
    return null;
  }
} 