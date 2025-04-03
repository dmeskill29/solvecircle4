# SolveCircle - Gamified Task Management

A gamified task management platform where completing tasks earns rewards. Built with Next.js, TypeScript, Prisma, and Tailwind CSS.

## Features

- 🔐 User authentication with NextAuth.js
- 📱 Progressive Web App (PWA) support
- 🎯 Task management system
- 🎮 Gamification elements
- 🌓 Dark mode support
- 📱 Responsive design

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Prisma](https://www.prisma.io/) - Database ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [next-pwa](https://www.npmjs.com/package/next-pwa) - PWA support

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd solvecircle
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Fill in your environment variables in `.env`

4. Set up the database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

The application is deployed on Vercel. Any push to the main branch will trigger an automatic deployment.

## License

MIT
