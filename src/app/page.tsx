import NavBar from '@/components/navbar'
import About from '@/components/about'
import { Globe } from '@/components/ui/globe'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { pricingCards } from '@/constants/landing-page'
import clsx from 'clsx'
import { Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'


export default async function Home() {
  return (
    <main className="flex items-center justify-center flex-col bg-neutral-950 min-h-screen">
      <NavBar />
      <section className="h-screen w-full relative flex flex-col items-center justify-center overflow-hidden rounded-md bg-neutral-950 text-neutral-200">
        <div className="absolute inset-0 h-full w-full z-0 opacity-50">
          <Globe className="max-w-[800px]" />
        </div>
        
        <div className="z-10 flex flex-col items-center gap-6 mt-[-50px] md:mt-[-100px] px-4 text-center">
          <span className="text-orange bg-orange/20 px-4 py-2 rounded-full text-sm font-medium border border-orange/10 backdrop-blur-sm">
            An AI powered sales assistant chatbot
          </span>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent">
            Zilo AI
          </h1>
          <p className="text-neutral-400 max-w-lg text-lg md:text-xl">
            Your AI powered sales assistant! Embed Zilo AI into any website
            with just a snippet of code!
          </p>
          <div className="flex items-center gap-4">
            <Button className="bg-orange hover:bg-orange/90 font-bold text-white px-8 py-6 rounded-full text-lg shadow-lg shadow-orange/20 transition-all">
              Start For Free
            </Button>
            <Button className="bg-transparent hover:bg-neutral-800/50 border border-neutral-700 font-bold text-neutral-200 px-8 py-6 rounded-full text-lg transition-all backdrop-blur-sm">
              Pricing
            </Button>
          </div>
        </div>

      </section>
      
      <About />

      <section className="flex justify-center items-center flex-col gap-4 mt-20 mb-20">
        <h2 className="text-4xl text-center font-bold"> Choose what fits you right</h2>
        <p className="text-muted-foreground text-center max-w-lg">
          Our straightforward pricing plans are tailored to meet your needs. If
          {" you're"} not ready to commit you can get started for free.
        </p>
      </section>
      
      <div className="flex justify-center gap-4 flex-wrap mb-20 container">
        {pricingCards.map((card) => (
          <Card
            key={card.title}
            className={clsx('w-[300px] flex flex-col justify-between bg-neutral-900/50 backdrop-blur-md border-neutral-800 text-neutral-200 transition-all hover:scale-[1.02] hover:border-orange/50 duration-300', {
              'border-orange/40 bg-neutral-900/80 shadow-lg shadow-orange/10': card.title === 'Unlimited',
            })}
          >
            <CardHeader>
              <CardTitle className={clsx("text-2xl", {
                "text-orange": card.title === 'Unlimited',
                "text-neutral-200": card.title !== 'Unlimited'
              })}>
                {card.title}
              </CardTitle>
              <CardDescription className="text-neutral-400">
                {pricingCards.find((c) => c.title === card.title)?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-4xl font-bold text-white">{card.price}</span>
              <span className="text-neutral-500 ml-2">
                / month
              </span>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-6">
              <div className="flex flex-col gap-3 w-full">
                {card.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex gap-3 items-center"
                  >
                    <div className="bg-orange/20 p-1 rounded-full">
                        <Check className="w-3 h-3 text-orange" />
                    </div>
                    <p className="text-neutral-300 text-sm">{feature}</p>
                  </div>
                ))}
              </div>
              <Link
                href={`/dashboard?plan=${card.title}`}
                className={clsx(
                  "w-full text-center font-bold rounded-full py-3 transition-all duration-300",
                  {
                     "bg-orange text-white hover:bg-orange/90 shadow-lg shadow-orange/20": card.title === 'Unlimited',
                     "bg-orange-800 text-neutral-200 hover:bg-neutral-700 border border-neutral-700": card.title !== 'Unlimited' 
                  }
                )}
              >
                Get Started
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  )
}
