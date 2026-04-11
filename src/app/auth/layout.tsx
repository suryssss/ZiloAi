import { currentUser } from '@clerk/nextjs/server'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const Layout = async ({ children }: Props) => {
  const user = await currentUser()

  if (user) redirect('/')

  return (
    <div className="min-h-screen flex w-full justify-center bg-neutral-950 dark">
      <div className="w-[600px] ld:w-full flex flex-col items-start p-6">
        <div className="flex gap-1.5 justify-center text-2xl tracking-tighter text-neutral-200 mt-2 ml-2">
          <h1 className="font-bold">Zilo AI</h1>
        </div>
        {children}
      </div>
      <div className="hidden lg:flex flex-1 w-full max-h-full max-w-4000px overflow-hidden relative bg-neutral-900 flex-col pt-10 pl-24 gap-3">
        <h2 className="text-neutral-200 md:text-4xl font-bold">
          Hi, I’m your AI powered sales assistant, Zilo!
        </h2>
        <p className="text-neutral-400 md:text-sm mb-10">
          Zilo is capable of capturing lead information without a form...{' '}
          <br />
          something never done before 😉
        </p>
        <Image
          src="/images/app-ui.png"
          alt="app image"
          loading="lazy"
          sizes="30"
          className="absolute shrink-0 !w-[1600px] top-48"
          width={0}
          height={0}
        />
      </div>
    </div>
  )
}

export default Layout
