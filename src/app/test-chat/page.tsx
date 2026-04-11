'use client'
import React, { useEffect, useRef } from 'react'

export default function TestChatPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const BOT_ID = "3d464d05-1e1a-43f5-982f-6f3b9c0b0a85"

  useEffect(() => {
    // Wait for iframe to load, then send the Bot ID
    const timer = setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage(BOT_ID, '*')
        console.log('Sent BOT_ID to widget:', BOT_ID)
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ height: '100vh', width: '100vw', background: '#f0f2f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1>ZiloAI Frontend Testing Page</h1>
      <p>The chatbot widget should appear in the bottom right corner.</p>
      
      {/* This simulates how a real website would embed your chatbot */}
      <iframe
        ref={iframeRef}
        src="http://localhost:3000/chatbot"
        style={{
          border: 'none',
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '500px',
          height: '800px',
          zIndex: 9999
        }}
      />
    </div>
  )
}
