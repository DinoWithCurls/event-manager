import { ValidationError } from "./types"

export const getFieldError = (field: string, errors: ValidationError[]) => {
  return errors.find((error) => error.field === field)?.message
}
