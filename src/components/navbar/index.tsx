import Image from 'next/image'
import * as React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

function NavBar() {
  return (
    <div className="flex gap-5 justify-between items-center px-7 py-1 font-bold leading-[154.5%] max-md:flex-wrap max-md:px-5 w-full bg-neutral-950 text-neutral-200 z-50">
      <div className="flex gap-1.5 justify-center self-stretch my-auto text-2xl tracking-tighter text-neutral-200">
        <h1>Zilo AI</h1>
      </div>
      <ul className="gap-5 justify-between self-stretch my-auto text-sm leading-5 text-neutral-300 max-md:flex-wrap max-md:max-w-full font-normal hidden md:flex cursor-pointer">
        <li>Home</li>
        <li>Pricing</li>
        <li>Features</li>
        <li>Contact us</li>
      </ul>
      <Link
        href="/dashboard"
        className="bg-orange px-4 py-2 rounded-sm text-white"
      >
        Sign In
      </Link>
    </div>
  )
}

export default NavBar
