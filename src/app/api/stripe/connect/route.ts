import { client } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// This ensures the route is never statically generated at build time
export const dynamic = 'force-dynamic'

export async function POST() {
  console.log('--- STRIPE CONNECT START ---')
  const stripeSecret = process.env.STRIPE_SECRET
  if (!stripeSecret) {
      console.error('MISSING STRIPE_SECRET')
      return new NextResponse('Stripe not configured', { status: 500 })
  }
  
  const stripe = new Stripe(stripeSecret, {
    typescript: true,
    apiVersion: '2024-04-10',
  })

  try {
    const user = await currentUser()
    if (!user) {
      console.error('USER NOT AUTHENTICATED')
      return new NextResponse('User not authenticated', { status: 401 })
    }
    console.log(`User Authenticated: ${user.id}`)

    const dbUser = await client.user.findUnique({
      where: { clerkId: user.id },
    })
    console.log(`DB User Found: ${!!dbUser}`)

    if (!dbUser) {
      return new NextResponse('User not found', { status: 404 })
    }

    let stripeAccountId = dbUser.stripeId
    console.log(`Existing Stripe ID: ${stripeAccountId}`)

    if (stripeAccountId) {
      try {
        const account = await stripe.accounts.retrieve(stripeAccountId)
        console.log('Stripe Account verified:', account.id)
      } catch (error) {
        console.error('Stripe Account invalid or deleted:', error)
        stripeAccountId = null
      }
    }

    // 1. Create account only if it doesn't exist
    if (!stripeAccountId) {
      console.log('Creating new Stripe Account...')
      const account = await stripe.accounts.create({
        type: 'standard',
        country: 'US',
        email: user.emailAddresses[0].emailAddress,
      })
      console.log(`Stripe Account Created: ${account.id}`)

      stripeAccountId = account.id

      // 2. Save it immediately
      await client.user.update({
        where: { clerkId: user.id },
        data: { stripeId: stripeAccountId },
      })
      console.log('Stripe ID saved to DB')
    }

    // 3. Create account link for onboarding (idempotent action)
    const origin =
      process.env.NEXT_PUBLIC_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    
    console.log(`Generating Link for Origin: ${origin}`)
    
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${origin}/callback/stripe/refresh`,
      return_url: `${origin}/callback/stripe/success`,
      type: 'account_onboarding',
    })
    
    console.log(`Link Generated: ${accountLink.url}`)

    return NextResponse.json({
      url: accountLink.url,
    })
  } catch (error: any) {
    console.error('Stripe connect error (FULL):', error)
    return new NextResponse(JSON.stringify({ error: error.message, details: error }), { status: 500 })
  }
}
