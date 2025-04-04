const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Create initial achievements
  const achievements = [
    {
      name: 'First Steps',
      description: 'Complete your first task',
      icon: '🎯',
      type: 'TASKS_COMPLETED',
      threshold: 1,
      points: 50,
    },
    {
      name: 'Rising Star',
      description: 'Complete 10 tasks',
      icon: '⭐',
      type: 'TASKS_COMPLETED',
      threshold: 10,
      points: 100,
    },
    {
      name: 'Task Master',
      description: 'Complete 50 tasks',
      icon: '🏆',
      type: 'TASKS_COMPLETED',
      threshold: 50,
      points: 500,
    },
    {
      name: 'Point Collector',
      description: 'Earn 1000 points',
      icon: '💎',
      type: 'POINTS_EARNED',
      threshold: 1000,
      points: 200,
    },
    {
      name: 'High Achiever',
      description: 'Earn 5000 points',
      icon: '🌟',
      type: 'POINTS_EARNED',
      threshold: 5000,
      points: 1000,
    },
    {
      name: 'Task Creator',
      description: 'Create your first task (Managers only)',
      icon: '📝',
      type: 'TASKS_CREATED',
      threshold: 1,
      points: 100,
    },
    {
      name: 'Team Leader',
      description: 'Create 10 tasks (Managers only)',
      icon: '👑',
      type: 'TASKS_CREATED',
      threshold: 10,
      points: 200,
    },
    {
      name: 'Dedicated',
      description: 'Active for 7 days',
      icon: '🌅',
      type: 'DAYS_ACTIVE',
      threshold: 7,
      points: 100,
    },
    {
      name: 'Veteran',
      description: 'Active for 30 days',
      icon: '🌠',
      type: 'DAYS_ACTIVE',
      threshold: 30,
      points: 500,
    },
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: achievement,
      create: achievement,
    })
  }

  // Create sample rewards
  const rewards = [
    {
      name: 'Coffee Break',
      description: 'A free coffee from the office coffee machine',
      pointsCost: 100,
      available: true,
    },
    {
      name: 'Extra Break Time',
      description: '30 minutes of extra break time',
      pointsCost: 200,
      available: true,
    },
    {
      name: 'Work From Home Day',
      description: 'One day of remote work',
      pointsCost: 500,
      available: true,
    },
    {
      name: 'Team Lunch',
      description: 'Free lunch with your team',
      pointsCost: 300,
      available: true,
    },
    {
      name: 'Professional Development Course',
      description: 'Access to an online course of your choice',
      pointsCost: 1000,
      available: true,
    },
  ]

  for (const reward of rewards) {
    await prisma.rewardItem.upsert({
      where: { name: reward.name },
      update: reward,
      create: reward,
    })
  }

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 