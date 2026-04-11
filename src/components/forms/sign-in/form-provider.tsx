'use client'
import { Loader } from '@/components/loader'
import { AuthContextProvider } from '@/context/use-auth-context'
import { useSignInForm } from '@/hooks/sign-in/use-sign-in'
import React from 'react'
import { FormProvider } from 'react-hook-form'

type Props = {
  children: React.ReactNode
}

const SignInFormProvider = ({ children }: Props) => {
  const { methods, onHandleSubmit, loading, needsOTP, otp, setOtp, onVerifyOTP } =
    useSignInForm()

  return (
    <AuthContextProvider>
      <FormProvider {...methods}>
        {needsOTP ? (
          <div className="flex flex-col gap-5 h-full justify-center">
            <h2 className="text-neutral-200 md:text-4xl font-bold">
              Verify Your Identity
            </h2>
            <p className="text-neutral-400 md:text-sm">
              Enter the verification code sent to your email
            </p>
            <Loader loading={loading}>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="flex h-12 w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-lg text-center tracking-[0.5em] ring-offset-background placeholder:text-muted-foreground placeholder:tracking-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <button
                  type="button"
                  onClick={onVerifyOTP}
                  disabled={otp.length < 6}
                  className="w-full bg-orange text-white hover:opacity-90 h-10 px-4 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Verify & Sign In
                </button>
              </div>
            </Loader>
          </div>
        ) : (
          <form
            onSubmit={onHandleSubmit}
            className="h-full"
          >
            <div className="flex flex-col justify-between gap-3 h-full">
              <Loader loading={loading}>{children}</Loader>
            </div>
          </form>
        )}
      </FormProvider>
    </AuthContextProvider>
  )
}

export default SignInFormProvider
