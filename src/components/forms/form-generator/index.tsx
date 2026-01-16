import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { strict } from 'assert'
import { ErrorMessage } from '@hookform/error-message'
import React from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'

type Props = {
  type: 'text' | 'email' | 'password'
  inputType: 'select' | 'input' | 'textarea'
  options?: { value: string; label: string; id: string }[]
  label?: string
  placeholder: string
  register: UseFormRegister<any>
  name: string
  errors: FieldErrors<FieldValues>
  lines?: number
  form?: string
  defaultValue?: string
}

const FormGenerator = ({
  errors,
  inputType,
  name,
  placeholder,
  defaultValue,
  register,
  type,
  form,
  label,
  lines,
  options,
}: Props) => {
  switch (inputType) {
    case 'input':
    default:
      return (
        <Label
          className="flex flex-col gap-2"
          htmlFor={`input-${label}`}
        >
          {label && label}
          <Input
            id={`input-${label}`}
            type={type}
            placeholder={placeholder}
            form={form}
            defaultValue={defaultValue}
            {...register(name)}
          />
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-2">
                {message === 'Required' ? '' : message}
              </p>
            )}
          />
        </Label>
      )
    case 'select':
      return (
        <Label
          htmlFor={`select-${label}`}
          className="flex flex-col gap-2"
        >
          {label && label}
          <select
            form={form}
            id={`select-${label}`}
            {...register(name)}
            className="w-full bg-background border border-input text-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-muted-foreground"
          >
            {options?.length &&
              options.map((option) => (
                <option
                  value={option.value}
                  key={option.id}
                  className="bg-background text-foreground"
                >
                  {option.label}
                </option>
              ))}
          </select>
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-2">
                {message === 'Required' ? '' : message}
              </p>
            )}
          />
        </Label>
      )
    case 'textarea':
      return (
        <Label
          className="flex flex-col gap-2"
          htmlFor={`input-${label}`}
        >
          {label && label}
          <Textarea
            form={form}
            id={`input-${label}`}
            placeholder={placeholder}
            {...register(name)}
            rows={lines}
            defaultValue={defaultValue}
          />
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-2">
                {message === 'Required' ? '' : message}
              </p>
            )}
          />
        </Label>
      )
      defualt: return <></>
  }
}

export default FormGenerator
