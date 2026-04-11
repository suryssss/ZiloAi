import { onAiChatBotAssistant, onGetCurrentChatBot } from '@/actions/bot'
import { postToParent, pusherClient } from '@/lib/utils'
import {
  ChatBotMessageProps,
  ChatBotMessageSchema,
} from '@/schemas/conversation.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { UploadClient } from '@uploadcare/upload-client'

import { useForm } from 'react-hook-form'

const upload = new UploadClient({
  publicKey: process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY as string,
})

export const useChatBot = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChatBotMessageProps>({
    resolver: zodResolver(ChatBotMessageSchema),
  })
  const [currentBot, setCurrentBot] = useState<
    | {
        name: string
        chatBot: {
          id: string
          icon: string | null
          welcomeMessage: string | null
          background: string | null
          textColor: string | null
          helpdesk: boolean
        } | null
        helpdesk: {
          id: string
          question: string
          answer: string
          domainId: string | null
        }[]
      }
    | undefined
  >()
  const messageWindowRef = useRef<HTMLDivElement | null>(null)
  const [botOpened, setBotOpened] = useState<boolean>(false)
  const onOpenChatBot = () => setBotOpened((prev) => !prev)
  const [loading, setLoading] = useState<boolean>(true)
  const [onChats, setOnChats] = useState<
    { role: 'assistant' | 'user'; content: string; link?: string }[]
  >([])
  const [onAiTyping, setOnAiTyping] = useState<boolean>(false)
  const [currentBotId, setCurrentBotId] = useState<string>()
  const [onRealTime, setOnRealTime] = useState<
    { chatroom: string; mode: boolean } | undefined
  >(undefined)

  const onScrollToBottom = () => {
    messageWindowRef.current?.scroll({
      top: messageWindowRef.current.scrollHeight,
      left: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    onScrollToBottom()
  }, [onChats, messageWindowRef])

  useEffect(() => {
    postToParent(
      JSON.stringify({
        width: botOpened ? 470 : 56,
        height: botOpened ? 800 : 56,
      })
    )
  }, [botOpened])

  const limitRequest = useRef(0)

  const onGetDomainChatBot = async (id: string) => {
    setCurrentBotId(id)
    const chatbot = await onGetCurrentChatBot(id)
    if (chatbot) {
      setOnChats((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: chatbot.chatBot?.welcomeMessage!,
        },
      ])
      setCurrentBot(chatbot)
      setLoading(false)
    }
  }

  useEffect(() => {
    window.addEventListener('message', (e) => {
      console.log(e.data)
      const botid = e.data
      if (limitRequest.current < 1 && typeof botid == 'string') {
        const cleanId = botid.replace(/^["']+|["']$/g, '')
        // Validate UUID format (8-4-4-4-12 hex digits)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        
        if (uuidRegex.test(cleanId)) {
           console.log('Sending valid UUID:', cleanId)
           onGetDomainChatBot(cleanId)
           limitRequest.current++
        }

      }
    })
  }, [])

  const onStartChatting = handleSubmit(async (values) => {
    if (!currentBotId) return

    let currentMessages = [...onChats]

    try {
      if (values.image?.length) {
        setLoading(true)
        const uploaded = await upload.uploadFile(values.image[0])
        const imageMessage = {
          role: 'user' as const,
          content: uploaded.uuid,
        }

        if (!onRealTime?.mode) {
          setOnChats((prev) => [...prev, imageMessage])
          currentMessages.push(imageMessage)
        }
      }

      if (values.content) {
        const textMessage = {
          role: 'user' as const,
          content: values.content,
        }

        if (!onRealTime?.mode) {
          setOnChats((prev) => [...prev, textMessage])
          currentMessages.push(textMessage)
        }
      }

      setOnAiTyping(true)
      const lastMessage = values.content || (values.image?.length ? 'Image uploaded' : '')
      
      const response = await onAiChatBotAssistant(
        currentBotId,
        currentMessages,
        'user',
        lastMessage
      )

      if (response) {
        if (response.live) {
          setOnRealTime((prev) => ({
            ...prev,
            chatroom: response.chatRoom,
            mode: response.live,
          }))
        } else if (response.response) {
          setOnChats((prev: any) => [...prev, response.response])
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setOnAiTyping(false)
      setLoading(false)
      reset()
    }
  })

  return {
    botOpened,
    onOpenChatBot,
    onStartChatting,
    onChats,
    register,
    onAiTyping,
    messageWindowRef,
    currentBot,
    loading,
    setOnChats,
    onRealTime,
    errors,
  }
}

export const useRealTime = (
  chatRoom: string,
  setChats: React.Dispatch<
    React.SetStateAction<
      {
        role: 'user' | 'assistant'
        content: string
        link?: string | undefined
      }[]
    >
  >
) => {
  const counterRef = useRef(1)

  useEffect(() => {
    if (!pusherClient) return

    pusherClient.subscribe(chatRoom)
    pusherClient.bind('realtime-mode', (data: any) => {
      console.log('✅', data)
      if (counterRef.current !== 1) {
        setChats((prev: any) => [
          ...prev,
          {
            role: data.chat.role,
            content: data.chat.message,
          },
        ])
      }
      counterRef.current += 1
    })
    return () => {
      pusherClient.unbind('realtime-mode')
      pusherClient.unsubscribe(chatRoom)
    }
  }, [chatRoom, setChats])
}
