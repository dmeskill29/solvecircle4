import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-200 to-accent-200 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            About SolveCircle
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            SolveCircle is a gamified task management platform designed to make
            work more engaging and rewarding. We combine productivity with fun
            to create a unique work experience.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <div className="flex flex-col bg-white/50 backdrop-blur-sm rounded-2xl p-8 ring-1 ring-gray-900/10">
            <h2 className="text-base font-semibold leading-7 text-primary-600">
              Task Management
            </h2>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
              Organize & Track
            </p>
            <p className="mt-6 flex-auto text-base leading-7 text-gray-600">
              Efficiently manage tasks with our intuitive interface. Create,
              assign, and track tasks with ease. Set priorities, deadlines, and
              watch your team's productivity soar.
            </p>
          </div>

          <div className="flex flex-col bg-white/50 backdrop-blur-sm rounded-2xl p-8 ring-1 ring-gray-900/10">
            <h2 className="text-base font-semibold leading-7 text-accent-600">
              Points System
            </h2>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
              Earn & Achieve
            </p>
            <p className="mt-6 flex-auto text-base leading-7 text-gray-600">
              Every completed task earns points. Climb the leaderboard, unlock
              achievements, and compete with your teammates in a friendly
              environment.
            </p>
          </div>

          <div className="flex flex-col bg-white/50 backdrop-blur-sm rounded-2xl p-8 ring-1 ring-gray-900/10">
            <h2 className="text-base font-semibold leading-7 text-primary-600">
              Rewards
            </h2>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
              Redeem & Enjoy
            </p>
            <p className="mt-6 flex-auto text-base leading-7 text-gray-600">
              Turn your hard-earned points into real rewards. From extra time
              off to company swag, make your work count beyond just completion.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-2xl lg:mx-0 mt-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            How It Works
          </h2>
          <div className="mt-8 space-y-12">
            <div className="relative">
              <div className="flex items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600 flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75M4.5 6.108c0-1.135.845-2.098 1.976-2.192a48.424 48.424 0 011.123-.08m5.801 0c.065.21.1.433.1.664 0 .414-.336.75-.75.75h-4.5A.75.75 0 017.5 4.23c0-.231.035-.454.1-.664M4.5 6.108V19.5a2.25 2.25 0 002.25 2.25h.75"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    1. Browse Available Tasks
                  </h3>
                  <p className="mt-2 text-base text-gray-600">
                    View the task board and find tasks that match your skills
                    and interests.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="flex items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-500 flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    2. Complete Tasks
                  </h3>
                  <p className="mt-2 text-base text-gray-600">
                    Take on tasks and complete them to earn points. Track your
                    progress in real-time.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="flex items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600 flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    3. Earn Rewards
                  </h3>
                  <p className="mt-2 text-base text-gray-600">
                    Use your points to claim rewards from our reward catalog.
                    The more you contribute, the more you earn!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl text-center">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <Link
              href="/auth/signin"
              className="rounded-l-md bg-primary-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/tasks"
              className="rounded-r-md bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 transition-colors"
            >
              View Tasks
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary-200 to-accent-200 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
      </div>
    </div>
  );
}
