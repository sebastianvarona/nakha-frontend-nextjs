import React from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'

import classes from './index.module.scss'

type Props = {
  name: string
  label: string
  register: UseFormRegister<FieldValues & any>
  required?: boolean
  error: any
  type?: 'text' | 'number' | 'password'
  rows?: number
}

export const Input: React.FC<Props> = ({
  name,
  label,
  required,
  register,
  error,
  type = 'text',
  rows,
}) => {
  return (
    <div className={classes.input}>
      <label htmlFor="name" className={classes.label}>
        {`${label} ${required ? '*' : ''}`}
      </label>
      {rows ? (
        <textarea {...{ type }} {...register(name, { required })} rows={rows} maxLength={500} />
      ) : (
        <input {...{ type }} {...register(name, { required })} />
      )}
      {error && <div className={classes.error}>This field is required</div>}
    </div>
  )
}
