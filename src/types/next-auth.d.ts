import { DefaultSession } from 'next-auth'
import { UserRole } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: UserRole
      points: number
      businessId?: string
    } & DefaultSession['user']
  }

  interface User {
    role: UserRole
    points: number
    businessId?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
    points: number
    businessId?: string
  }
} 