import { TextField } from 'payload-plugin-form-builder/dist/types'
import React from 'react'
import { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '../../../components/Input'

export const Text: React.FC<
  TextField & {
    register: UseFormRegister<FieldValues & any>
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
  }
> = ({ name, label, width, register, required: requiredFromProps, errors }) => {
  return (
    <Input
      label={label}
      error={errors[name]}
      type="text"
      name={name}
      required={requiredFromProps}
      register={register}
    />
  )
}
