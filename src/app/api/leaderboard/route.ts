import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all-time';

    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case 'weekly':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = {
          unlockedAt: {
            gte: weekAgo
          }
        };
        break;
      case 'monthly':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFilter = {
          unlockedAt: {
            gte: monthAgo
          }
        };
        break;
      // 'all-time' doesn't need a date filter
    }

    // Get top 10 users with their points and achievements
    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        points: true,
        achievements: {
          where: dateFilter,
          select: {
            achievement: {
              select: {
                name: true,
                description: true,
                icon: true,
                points: true,
              }
            },
            unlockedAt: true,
          },
          orderBy: {
            unlockedAt: 'desc'
          }
        }
      },
      orderBy: {
        points: 'desc'
      },
      take: 10
    });

    return NextResponse.json({
      leaderboard: leaderboard.map(user => ({
        id: user.id,
        name: user.name,
        image: user.image,
        points: user.points,
        achievements: user.achievements.map(ua => ({
          ...ua.achievement,
          unlockedAt: ua.unlockedAt
        }))
      }))
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
} 