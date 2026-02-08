# User Management CRUD Application

A modern, extensible React-based CRUD application for managing user data. Built with TypeScript, Tailwind CSS, shadcn/ui, and Zod validation.

## Features

- Full CRUD operations (Create, Read, Update, Delete)
- Real-time form validation with Zod
- Responsive design with Tailwind CSS
- Modern UI components with shadcn/ui
- TypeScript for type safety
- Schema-driven architecture for easy extensibility
- Toast notifications for user feedback
- Serverless API with Vercel Functions

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Zod** - Schema validation
- **Vercel Functions** - Serverless API

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd delta-sigma-ventures
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application uses mock data in development mode, so no backend setup is required.

4. Open your browser to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## How to Add New Fields

The application is designed for easy extensibility. Adding a new field requires only updating the schema configuration.

### Example: Adding "Date of Birth" Field

**Step 1:** Update the Zod schema in `src/config/fieldSchema.ts`:

```typescript
export const userSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone Number is required")
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
      "Phone Number format is invalid",
    ),
  email: z
    .string()
    .min(1, "Email Address is required")
    .email("Email Address format is invalid"),
  // Add new field here:
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
})
```

**Step 2:** Add the field definition to `USER_FIELDS` array in the same file:

```typescript
export const USER_FIELDS: FieldDefinition[] = [
  // ... existing fields
  {
    name: "dateOfBirth",
    label: "Date of Birth",
    type: "date",
    placeholder: "Select date of birth",
  },
]
```

That's it! The form, validation, and table will automatically include the new field. No changes needed to components or API logic.

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── UserForm.tsx     # Form component
│   └── UserList.tsx     # List/table component
├── config/
│   └── fieldSchema.ts   # Field definitions and validation schema
├── services/
│   ├── api.ts           # API client
│   └── mockData.ts      # Mock data for development
├── utils/
│   └── validation.ts    # Validation utilities
├── lib/
│   └── utils.ts         # Utility functions
├── App.tsx              # Main app component
└── main.tsx             # Entry point

api/
└── users.js             # Vercel serverless function
```

## Design Decisions

### Schema-Driven Architecture

The application uses a centralized schema (`fieldSchema.ts`) to define all form fields. This enables adding new fields by simply updating the configuration, without modifying component logic.

### Zod for Validation

Zod provides type-safe validation with excellent TypeScript integration. The schema serves as both runtime validation and TypeScript type inference, ensuring consistency between validation rules and types.

### Component Composition

Small, reusable components (UserForm, UserList) compose into the main application. Each component has a single responsibility and accepts props for customization.

### Vercel Serverless Functions

The API runs as serverless functions on Vercel, eliminating the need for separate backend deployment. In development, the app uses mock data for a seamless local experience.

### Key Prop Pattern

Instead of using `useEffect` to reset form state, the application uses React's `key` prop to remount the component when switching between create/edit modes. This is more performant and follows React best practices.

### shadcn/ui Components

Using shadcn/ui provides accessible, customizable components that live in the codebase rather than being locked into a component library. This allows for easy customization and maintenance.

## Assumptions

1. **Data Persistence**: The serverless API uses in-memory storage for demonstration purposes. Data resets on each deployment. For production use, a database (e.g., Supabase, Firebase) would be integrated.

2. **Phone Number Validation**: Accepts international phone number formats with flexible validation (digits, spaces, dashes, parentheses, plus sign). The regex pattern accommodates various formats.

3. **User IDs**: Generated as simple incrementing strings for the demo. In production, UUIDs or database-generated IDs would be used.

4. **Authentication**: Not implemented as it's outside the scope of this assignment. In a production environment, authentication and authorization would be required.

5. **Field Types**: Currently supports text, email, tel, and date input types. The architecture can be extended to support additional types (textarea, select, checkbox, etc.) by updating the FieldDefinition interface.

6. **Error Handling**: Basic error messages are displayed to users. In production, more comprehensive error logging and user-friendly error messages would be implemented.

7. **Browser Support**: Targets modern browsers with ES2022 support. For broader compatibility, additional polyfills would be needed.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Go to [vercel.com](https://vercel.com) and import your repository

3. Vercel will auto-detect the Vite configuration and deploy both frontend and API

4. The application will be live with a public URL

**Note**: The serverless API uses in-memory storage. For production with persistent data, integrate a database service.

## API Endpoints

The serverless API provides these endpoints:

- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `PUT /api/users?id={id}` - Update a user
- `DELETE /api/users?id={id}` - Delete a user

## License

MIT

## Author

Built for Delta Sigma Ventures technical assessment
