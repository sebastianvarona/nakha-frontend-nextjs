import { useRouter } from 'next/router'
import { Form as FormType } from 'payload-plugin-form-builder/dist/types'
import React, { useCallback, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { buildInitialFormState } from './buildInitialFormState'
import { fields } from './fields'

import { Cell, Grid } from '@faceless-ui/css-grid'
import { useInView } from 'framer-motion'
import { Button } from '../../components/Button'
import RichText from '../../components/RichText'
import { Media } from '../../payload-types'
import classes from './index.module.scss'

export type Value = unknown

export interface Property {
  [key: string]: Value
}

export interface Data {
  [key: string]: Value | Property | Property[]
}

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: Boolean
  form: FormType
  introContent?: {
    [k: string]: unknown
  }[]
  image?: Media
}

export const FormBlock: React.FC<
  FormBlockType & {
    id?: string
  }
> = props => {
  const {
    enableIntro,
    introContent,
    image,
    form: formFromProps,
    form: { id: formID, submitButtonLabel, confirmationType, redirect, confirmationMessage } = {},
  } = props

  const formMethods = useForm({
    defaultValues: buildInitialFormState(formFromProps.fields),
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ status?: string; message: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: Data) => {
      let loadingTimerID: NodeJS.Timer

      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/form-submissions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)
            setError({
              status: res.status,
              message: res.errors?.[0]?.message || 'Internal Server Error',
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const [title, setTitle] = useState(introContent)

  return (
    <Grid className={classes.ctaWithImage}>
      <Cell
        cols={6}
        colsM={12}
        ref={ref}
        style={{
          transform: isInView ? 'none' : 'translateX(-200px)',
          opacity: isInView ? 1 : 0,
          transition: 'all 0.6s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s',
        }}
      >
        <div className={classes.imageWrapper}>
          <img src={image.url} alt={image.alt} />
        </div>
      </Cell>
      <Cell
        cols={6}
        colsM={12}
        className={[classes.form, hasSubmitted && classes.hasSubmitted].filter(Boolean).join(' ')}
      >
        <div className={classes.content}>
          {enableIntro && introContent && !hasSubmitted && (
            <RichText className={classes.intro} content={title} />
          )}
          {/* Divider */}
          <div className={classes.divider} />
          {!isLoading && hasSubmitted && confirmationType === 'message' && (
            <RichText className={classes.confirmationMessage} content={confirmationMessage} />
          )}
          {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
          {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
          {!hasSubmitted && (
            <form id={formID} onSubmit={handleSubmit(onSubmit)}>
              <div className={classes.fieldWrap}>
                {formFromProps &&
                  formFromProps.fields &&
                  formFromProps.fields.map((field, index) => {
                    const Field: React.FC<any> = fields?.[field.blockType]
                    if (Field) {
                      return (
                        <React.Fragment key={index}>
                          <Field
                            form={formFromProps}
                            {...field}
                            {...formMethods}
                            register={register}
                            errors={errors}
                            control={control}
                          />
                        </React.Fragment>
                      )
                    }
                    return null
                  })}
              </div>
              <Button
                type="submit"
                label={submitButtonLabel}
                className={classes.submitButton}
                appearance="primary"
                el="button"
                form={formID}
              />
            </form>
          )}
        </div>
      </Cell>
    </Grid>
  )
}
