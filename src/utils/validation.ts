import { userSchema } from "../config/fieldSchema"
import { ZodError } from "zod"

export function validateUserData(data: Record<string, string>): {
  success: boolean
  errors: Record<string, string>
} {
  try {
    userSchema.parse(data)
    return { success: true, errors: {} }
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message
        }
      })
      return { success: false, errors }
    }
    return { success: false, errors: { _form: "Validation failed" } }
  }
}
