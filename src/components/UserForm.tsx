import { useState } from "react"
import { USER_FIELDS } from "../config/fieldSchema"
import { validateUserData } from "../utils/validation"
import { type User } from "../services/api"

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
    }
  }

  const handleCancelClick = () => {
    setValues({})
    setTouched({})
    setErrors({})
    onCancel?.()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md mb-8"
    >
      <h2 className="text-2xl font-bold mb-6">
        {initialUser ? "Edit User" : "Add New User"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {USER_FIELDS.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label
              htmlFor={field.name}
              className="mb-2 font-medium text-gray-700"
            >
              {field.label}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              value={values[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field.name)}
              placeholder={field.placeholder}
              disabled={loading}
              className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                touched[field.name] && errors[field.name]
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {touched[field.name] && errors[field.name] && (
              <span className="text-red-500 text-sm mt-1">
                {errors[field.name]}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Saving..." : initialUser ? "Update User" : "Add User"}
        </button>
        {initialUser && (
          <button
            type="button"
            onClick={handleCancelClick}
            disabled={loading}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
