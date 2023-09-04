import { SelectField } from 'payload-plugin-form-builder/dist/types'
import React from 'react'
import { Control, Controller, FieldErrorsImpl, FieldValues } from 'react-hook-form'
import { Error } from '../Error'
import { Width } from '../Width'

import ReactSelect from 'react-select'
import classes from './index.module.scss'

export const Select: React.FC<
  SelectField & {
    control: Control<FieldValues, any>
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
  }
> = ({ name, label, width, options, control, required, errors }) => {
  return (
    <Width width={width}>
      <div className={classes.select}>
        <label htmlFor="name" className={classes.label}>
          {label}
        </label>
        <Controller
          control={control}
          rules={{ required }}
          name={name}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <ReactSelect
              instanceId={name}
              options={options}
              value={options.find(s => s.value === value)}
              onChange={val => onChange(val.value)}
              className={classes.reactSelect}
              classNamePrefix="rs"
            />
          )}
        />
        {required && errors[name] && <Error />}
      </div>
    </Width>
  )
}
