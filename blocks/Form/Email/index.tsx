import { EmailField } from 'payload-plugin-form-builder/dist/types'
import React from 'react'
import { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '../../../components/Input'

export const Email: React.FC<
  EmailField & {
    register: UseFormRegister<FieldValues & any>
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
  }
> = ({ name, width, label, register, required: requiredFromProps, errors }) => {
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
