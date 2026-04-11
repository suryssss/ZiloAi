import { pusherServer } from '@/lib/utils'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { chatroomId, message, role } = body

    if (!chatroomId || !message) {
      return NextResponse.json(
        { error: 'Missing chatroomId or message' },
        { status: 400 }
      )
    }

    await pusherServer.trigger(chatroomId, 'realtime-mode', {
      chat: {
        message,
        id: 'test-' + Date.now(),
        role: role || 'assistant',
      },
    })

    return NextResponse.json({ success: true, message: 'Event triggered' })
  } catch (error) {
    console.error('Pusher test endpoint error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
