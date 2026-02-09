# AGENTS.md

## Project
CAFA Ticket Mobile is the mobile app for CAFA Tickets (event ticketing platform).

## Primary Reference Codebase (Web)
Use the web app as the source of truth for behavior and feature parity:

- Web project path: `D:\KLASIQUE STUFF\D-klasique-projects\cafa-tickets`

When implementing or fixing mobile features, check the equivalent web flow, naming, validations, and API usage first.

## Tech Stack
- Expo SDK 54
- Expo Router v6 (file-based routing)
- TypeScript (strict mode)
- NativeWind v4 (Tailwind for React Native)
- Formik + Yup
- Axios
- @gorhom/bottom-sheet
- @shopify/flash-list
- expo-image

## Project Structure
- `app/`: Expo Router routes
  - `(auth)/`: auth screens
  - `(tabs)/`: tab screens
  - `dashboard/`: dashboard screens
  - `_layout.tsx`: root layout
  - `index.tsx`: entry/splash
- `components/`: reusable components
  - `ui/`, `form/`, `cards/`, `layout/`
- `config/`, `constants/`, `context/`, `hooks/`, `types/`, `utils/`, `data/`, `lib/`, `assets/`

## Commands
- `npx expo start` (preferred first command)
- `npm start`
- `npm run android`
- `npm run ios`
- `npm run web`
- `npm run lint`

## Path Alias
- `@/*` -> project root (example: `@/components`, `@/context`)

## Naming Conventions
- Component files: PascalCase (`LoginForm.tsx`, `AppButton.tsx`)
- Utility files: camelCase (`validationUtils.ts`, `formatDate.ts`)
- Type files: PascalCase + `.types.ts` suffix (`events.types.ts`)
- UI components prefixed with `App` (`AppForm`, `AppButton`)
- Hooks prefixed with `use` (`useModal`, `useDebounce`)
- Variables/functions: camelCase
- Booleans: `is*`, `has*`, `can*`

## Design Tokens (Core Colors)
- Primary: `#050E3C`
- Primary-100: `#002455`
- Primary-200: `#134686`
- Accent: `#DC0000`
- Accent-50: `#FF5555`
- Accent-100: `#FF3838`

## Forms Pattern
Use Formik + Yup with shared form components:
- `AppForm`
- `AppFormField`
- `SubmitButton`

## API and Auth Pattern
Reference mobile architecture pattern from:
- `C:\Users\DELL\Desktop\klasique-projects\1MOBILE\PicknRyde-Mobile`

Standards:
- Store auth tokens in `expo-secure-store`
- Store user cache/non-sensitive data in `AsyncStorage`
- Use Axios client in `lib/client.ts` with request interceptor to attach bearer token
- Keep auth state in `context/AuthContext.tsx`
- Gate protected content using auth-aware wrappers/components
- Place `AuthProvider` outermost in provider nesting
- Keep API domain modules in `lib/*` (`auth.ts`, `events.ts`, etc.)

## Implementation Conventions
- Prefer NativeWind classes via `className`
- Use `expo-router` navigation (`Link`, `router.push`, etc.)
- Wrap screens in shared layout components (`Screen` / `AltScreen`)
- Use Yup validation schemas for form rules
- Use `expo-image` for image rendering
- Prefer `FlashList` over `FlatList` for performance-sensitive lists
- Keep mobile behavior aligned with web where platform constraints allow

## Working Rule for New Tasks
For every non-trivial feature or bug fix:
1. Locate the equivalent flow in the web project path.
2. Reuse the same business rules, validation logic, and API contract.
3. Adapt UI/interaction for mobile ergonomics without changing core behavior.
4. Verify route structure and naming remain consistent with Expo Router conventions.
