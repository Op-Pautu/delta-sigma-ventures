import { z } from "zod"

export interface FieldDefinition {
  name: string
  label: string
  type: "text" | "email" | "tel"
  placeholder?: string
}

// Zod schema for validation
export const userSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone Number is required")
    .regex(/^[\d\s\-+()]+$/, "Phone Number format is invalid"),
  email: z
    .string()
    .min(1, "Email Address is required")
    .email("Email Address format is invalid"),
})

export type UserFormData = z.infer<typeof userSchema>

// Field definitions for UI rendering
// To add a new field: 1) Add to userSchema above, 2) Add to USER_FIELDS below
export const USER_FIELDS: FieldDefinition[] = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    placeholder: "Enter first name",
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    placeholder: "Enter last name",
  },
  {
    name: "phoneNumber",
    label: "Phone Number",
    type: "tel",
    placeholder: "Enter phone number",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "Enter email address",
  },
]
