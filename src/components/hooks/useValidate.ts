import { useCallback, useMemo, useState } from 'react'

export type ValidationErrors<T extends Record<string, unknown>> = Partial<Record<keyof T, string>>

export const useValidate = <T extends Record<string, unknown>>(
  values: T,
  validateValues: (values: T) => ValidationErrors<T>
) => {
  const [errors, setErrors] = useState<ValidationErrors<T>>({})

  const validate = useCallback((): boolean => {
    const nextErrors = validateValues(values)
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }, [validateValues, values])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors])

  return {
    errors,
    hasErrors,
    validate,
    clearErrors
  }
}

