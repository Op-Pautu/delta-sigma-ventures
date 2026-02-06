import { useState } from "react"
import { USER_FIELDS } from "../config/fieldSchema"
import { validateUserData } from "../utils/validation"
import { type User } from "../services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UserFormProps {
  onSubmit: (user: User) => Promise<void>
  initialUser?: User | null
  loading?: boolean
  onCancel?: () => void
}

export function UserForm({
  onSubmit,
  initialUser,
  loading,
  onCancel,
}: UserFormProps) {
  // Initialize state based on initialUser
  const getInitialValues = () => {
    if (!initialUser) return {}
    const newValues: Record<string, string> = {}
    USER_FIELDS.forEach((field) => {
      newValues[field.name] = initialUser[field.name] || ""
    })
    return newValues
  }

  const [values, setValues] = useState<Record<string, string>>(getInitialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = validateUserData(values)
    setErrors(validation.errors)

    const allTouched: Record<string, boolean> = {}
    USER_FIELDS.forEach((field) => {
      allTouched[field.name] = true
    })
    setTouched(allTouched)

    if (validation.success) {
      try {
        const userData = {
          ...values,
          ...(initialUser?.id && { id: initialUser.id }),
        } as User
        await onSubmit(userData)
        if (!initialUser) {
          setValues({})
          setTouched({})
          setErrors({})
        }
      } catch (error) {
        // Error is handled by parent component
        console.error("Form submission error:", error)
      }
    }
  }

  const handleCancelClick = () => {
    setValues({})
    setTouched({})
    setErrors({})
    onCancel?.()
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{initialUser ? "Edit User" : "Add New User"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {USER_FIELDS.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>
                  {field.label}
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={values[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  onBlur={() => handleBlur(field.name)}
                  placeholder={field.placeholder}
                  disabled={loading}
                  className={
                    touched[field.name] && errors[field.name]
                      ? "border-destructive"
                      : ""
                  }
                />
                {touched[field.name] && errors[field.name] && (
                  <p className="text-sm text-destructive">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : initialUser ? "Update User" : "Add User"}
            </Button>
            {initialUser && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelClick}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
