import { useToast } from '@/components/ui/use-toast'
import { UserLoginProps, UserLoginSchema } from '@/schemas/auth.schema'
import { useSignIn } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export const useSignInForm = () => {
  const { isLoaded, setActive, signIn } = useSignIn()
  const [loading, setLoading] = useState<boolean>(false)
  const [needsOTP, setNeedsOTP] = useState<boolean>(false)
  const [otp, setOtp] = useState<string>('')
  const router = useRouter()
  const { toast } = useToast()
  
  const methods = useForm<UserLoginProps>({
    resolver: zodResolver(UserLoginSchema),
    mode: 'onChange',
  })

  const onHandleSubmit = methods.handleSubmit(
    async (values: UserLoginProps) => {
      if (!isLoaded) return

      try {
        setLoading(true)

        const authenticated = await signIn.create({
          identifier: values.email,
          password: values.password,
        })

        if (authenticated.status === 'complete') {
          await setActive({ session: authenticated.createdSessionId })
          toast({
            title: 'Success',
            description: 'Welcome back!',
          })
          router.push('/dashboard')
          return
        }

        if (authenticated.status === 'needs_second_factor') {
          // Password succeeded, but Clerk is enforcing 2FA
          const emailFactor = authenticated.supportedSecondFactors?.find(
            (f: any) => f.strategy === 'email_code'
          )
          
          if (emailFactor && 'emailAddressId' in emailFactor) {
            await signIn.prepareSecondFactor({
              strategy: 'email_code',
              emailAddressId: emailFactor.emailAddressId,
            } as any)
            
            setNeedsOTP(true)
            setLoading(false)
            toast({
              title: 'Verification Code Sent',
              description: 'A 2FA code was sent to your email.',
            })
            return
          }      
        }

        setLoading(false)
        toast({
          title: 'Sign In Incomplete',
          description: `Status: ${authenticated.status}. Check console for details.`,
        })

      } catch (error: any) {
        console.error('Sign-in error details:', JSON.stringify(error, null, 2))
        setLoading(false)

        const errorMessage =
          error?.errors?.[0]?.longMessage ||
          error?.errors?.[0]?.message ||
          error?.message ||
          'An error occurred. Please try again.'

        toast({
          title: 'Error',
          description: errorMessage,
        })
      }
    }
  )

  const onVerifyOTP = async () => {
    if (!isLoaded || !signIn) return

    try {
      setLoading(true)

      const result = await signIn.attemptSecondFactor({
        strategy: 'email_code',
        code: otp,
      } as any)

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        toast({
          title: 'Success',
          description: 'Welcome back!',
        })
        router.push('/dashboard')
      } else {
        setLoading(false)
        toast({
          title: 'Error',
          description: 'Verification failed. Please try again.',
        })
      }
    } catch (error: any) {
      console.error('OTP verification error:', error)
      setLoading(false)

      const errorMessage =
        error?.errors?.[0]?.longMessage ||
        error?.errors?.[0]?.message ||
        'Invalid verification code. Please try again.'

      toast({
        title: 'Error',
        description: errorMessage,
      })
    }
  }

  return {
    methods,
    onHandleSubmit,
    loading,
    needsOTP,
    otp,
    setOtp,
    onVerifyOTP,
  }
}
