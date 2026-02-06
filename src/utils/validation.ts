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
      error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as string] = issue.message
        }
      })
      return { success: false, errors }
    }
    console.error("Validation error:", error)
    return { success: false, errors: { _form: "Validation failed" } }
  }
}
