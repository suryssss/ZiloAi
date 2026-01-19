import { client } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  typescript: true,
  apiVersion: '2024-04-10',
})

export async function POST() {
  try {
    const user = await currentUser()
    if (!user) {
      return new NextResponse('User not authenticated', { status: 401 })
    }

    const dbUser = await client.user.findUnique({
      where: { clerkId: user.id },
    })

    if (!dbUser) {
      return new NextResponse('User not found', { status: 404 })
    }

    let stripeAccountId = dbUser.stripeId

    // 1. Create account only if it doesn't exist
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US', // Default to US, change if your app supports others
        email: user.emailAddresses[0].emailAddress,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      })

      stripeAccountId = account.id

      // 2. Save it immediately
      await client.user.update({
        where: { clerkId: user.id },
        data: { stripeId: stripeAccountId },
      })
    }

    // 3. Create account link for onboarding (idempotent action)
    const origin = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${origin}/callback/stripe/refresh`,
      return_url: `${origin}/callback/stripe/success`,
      type: 'account_onboarding',
    })

    return NextResponse.json({
      url: accountLink.url,
    })
  } catch (error) {
    console.error('Stripe connect error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
