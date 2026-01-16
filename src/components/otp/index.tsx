import React from 'react'
import { InputOTP, InputOTPSlot } from '../ui/input-otp'

type Props = {
  otp: string
  setOtp: React.Dispatch<React.SetStateAction<string>>
}

const OTPInput = ({ otp, setOtp }: Props) => {
  return (
    <InputOTP
      maxLength={6}
      value={otp}
      onChange={(otp) => setOtp(otp)}
    >
      <div className="flex gap-3">
        <div>
          <InputOTPSlot
            index={0}
            className="rounded-md border border-neutral-800 bg-neutral-900 text-neutral-200 text-lg font-bold"
          />
        </div>
        <div>
          <InputOTPSlot
            index={1}
            className="rounded-md border border-neutral-800 bg-neutral-900 text-neutral-200 text-lg font-bold"
          />
        </div>
        <div>
          <InputOTPSlot
            index={2}
            className="rounded-md border border-neutral-800 bg-neutral-900 text-neutral-200 text-lg font-bold"
          />
        </div>
        <div>
          <InputOTPSlot
            index={3}
            className="rounded-md border border-neutral-800 bg-neutral-900 text-neutral-200 text-lg font-bold"
          />
        </div>
        <div>
          <InputOTPSlot
            index={4}
            className="rounded-md border border-neutral-800 bg-neutral-900 text-neutral-200 text-lg font-bold"
          />
        </div>
        <div>
          <InputOTPSlot
            index={5}
            className="rounded-md border border-neutral-800 bg-neutral-900 text-neutral-200 text-lg font-bold"
          />
        </div>
      </div>
    </InputOTP>
  )
}

export default OTPInput
