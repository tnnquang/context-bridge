# Context Bridge

A lightweight library to bridge data from React Server Components to Client Components without using React Context. Perfect for Next.js App Router and other frameworks supporting React Server Components.

## Why Context Bridge?

- **Zero Runtime Overhead**: Data is serialized once during SSR and hydrated on the client
- **Type-Safe**: Full TypeScript support with proper type inference
- **Simple API**: Just two functions to learn
- **No Extra Dependencies**: Works with React 19+
- **RSC Compatible**: Designed specifically for React Server Components

## Installation

```bash
npm install @tnnquang/context-bridge
# or
pnpm add @tnnquang/context-bridge
# or
yarn add @tnnquang/context-bridge
```

## Peer Dependencies

- React 19.0.0 or higher

## Quick Start

### Step 1: Create Your Bridge

Create a file to define your bridge (e.g., `lib/user-bridge.ts`):

```typescript
import { createBridgeProvider } from '@tnnquang/context-bridge/server';
import { createBridgeHook } from '@tnnquang/context-bridge/client';

type User = {
  id: string;
  name: string;
  email: string;
};

// Create provider for Server Component
export const UserProvider = createBridgeProvider<User>('user');

// Create hook for Client Component
export const useUser = createBridgeHook<User>('user', {
  id: '',
  name: 'Guest',
  email: '',
});
```

### Step 2: Add BridgeSerializer to Root Layout

In your root layout (e.g., `app/layout.tsx`), add the `BridgeSerializer` component at the end of the `<body>` tag:

```typescript
import { BridgeSerializer } from '@tnnquang/context-bridge/server';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <BridgeSerializer />
      </body>
    </html>
  );
}
```

### Step 3: Provide Data in Server Component

Use the Provider in your Server Component to pass data:

```typescript
import { UserProvider } from '@/lib/user-bridge';

// This is a Server Component
export default async function Page() {
  // Fetch data on the server
  const user = await fetchUser();

  return (
    <UserProvider data={user}>
      <UserProfile />
      <UserDashboard />
    </UserProvider>
  );
}
```

### Step 4: Consume Data in Client Component

Use the hook in your Client Component to access the data:

```typescript
'use client';

import { useUser } from '@/lib/user-bridge';

export function UserProfile() {
  const user = useUser();

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

## Advanced Usage

### Multiple Bridges

You can create multiple bridges for different data types:

```typescript
// lib/bridges.ts
import { createBridgeProvider } from '@tnnquang/context-bridge/server';
import { createBridgeHook } from '@tnnquang/context-bridge/client';

// User bridge
type User = { id: string; name: string };
export const UserProvider = createBridgeProvider<User>('user');
export const useUser = createBridgeHook<User>('user', { id: '', name: '' });

// Theme bridge
type Theme = { mode: 'light' | 'dark'; primaryColor: string };
export const ThemeProvider = createBridgeProvider<Theme>('theme');
export const useTheme = createBridgeHook<Theme>('theme', {
  mode: 'light',
  primaryColor: '#000000',
});

// Settings bridge
type Settings = { language: string; notifications: boolean };
export const SettingsProvider = createBridgeProvider<Settings>('settings');
export const useSettings = createBridgeHook<Settings>('settings', {
  language: 'en',
  notifications: true,
});
```

### Nested Providers

Providers can be nested without any issues:

```typescript
export default async function Page() {
  const user = await fetchUser();
  const theme = await fetchTheme();
  const settings = await fetchSettings();

  return (
    <UserProvider data={user}>
      <ThemeProvider data={theme}>
        <SettingsProvider data={settings}>
          <Dashboard />
        </SettingsProvider>
      </ThemeProvider>
    </UserProvider>
  );
}
```

### Complex Data Types

Context Bridge supports any JSON-serializable data:

```typescript
type ComplexData = {
  users: User[];
  metadata: {
    timestamp: string;
    version: number;
  };
  settings: Record<string, any>;
  flags: boolean[];
};

export const DataProvider = createBridgeProvider<ComplexData>('complex-data');
export const useComplexData = createBridgeHook<ComplexData>('complex-data', {
  users: [],
  metadata: { timestamp: '', version: 0 },
  settings: {},
  flags: [],
});
```

## API Reference

### Server-Side API

#### `createBridgeProvider<T>(bridgeId: string)`

Creates a Provider component for Server Components.

**Parameters:**
- `bridgeId`: A unique string identifier for this bridge
- `T`: TypeScript type for the data

**Returns:** A Provider component with props:
- `data: T` - The data to pass to client components
- `children: ReactNode` - Child components

**Example:**
```typescript
const UserProvider = createBridgeProvider<User>('user');
```

#### `BridgeSerializer`

A component that serializes all bridge data into a script tag.

**Usage:**
```typescript
import { BridgeSerializer } from '@tnnquang/context-bridge/server';

// Place at the end of <body> in root layout
<body>
  {children}
  <BridgeSerializer />
</body>
```

### Client-Side API

#### `createBridgeHook<T>(bridgeId: string, defaultValue: T)`

Creates a hook for Client Components to access bridge data.

**Parameters:**
- `bridgeId`: Must match the bridgeId used in `createBridgeProvider`
- `defaultValue`: Default value if data is not available

**Returns:** A hook that returns data of type `T`

**Example:**
```typescript
const useUser = createBridgeHook<User>('user', {
  id: '',
  name: 'Guest',
});
```

## Best Practices

### 1. Use Consistent Bridge IDs

Always use the same `bridgeId` for both provider and hook:

```typescript
// Good
const bridgeId = 'user-data';
export const UserProvider = createBridgeProvider(bridgeId);
export const useUser = createBridgeHook(bridgeId, defaultUser);

// Bad - Different IDs
export const UserProvider = createBridgeProvider('user');
export const useUser = createBridgeHook('userData', defaultUser); // Won't work!
```

### 2. Provide Meaningful Default Values

Default values are used during initial hydration and when data is missing:

```typescript
// Good - Provides safe defaults
const useUser = createBridgeHook<User>('user', {
  id: '',
  name: 'Guest',
  email: '',
  isAuthenticated: false,
});

// Bad - Might cause runtime errors
const useUser = createBridgeHook<User>('user', null as any);
```

### 3. Keep Data JSON-Serializable

Only pass data that can be serialized to JSON:

```typescript
// Good
const data = {
  id: '123',
  name: 'John',
  createdAt: new Date().toISOString(), // Convert Date to string
};

// Bad - These will cause errors
const data = {
  onClick: () => {}, // Functions cannot be serialized
  element: <div />, // React elements cannot be serialized
  circularRef: obj, // Circular references will throw
};
```

### 4. Organize Bridges in Separate Files

Keep your bridges organized:

```
lib/
  bridges/
    user-bridge.ts
    theme-bridge.ts
    settings-bridge.ts
    index.ts  // Export all bridges
```

### 5. Use TypeScript for Type Safety

Always define proper types for your data:

```typescript
// Define your types
type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
};

// Use them in your bridge
export const UserProvider = createBridgeProvider<User>('user');
export const useUser = createBridgeHook<User>('user', defaultUser);
```

## Error Handling

Context Bridge provides helpful error messages in development:

### Serialization Errors

If you try to pass non-serializable data:

```typescript
// This will throw in development
<UserProvider data={{ onClick: () => {} }}>
  {children}
</UserProvider>

// Error: ContextBridge Warning [user]: Data passed to Provider is 'function'.
// It will be lost during serialization. Data must be JSON-serializable.
```

### Parse Errors

If data cannot be parsed on the client:

```
// Console: ContextBridge Error: Unable to parse data from server.
```

## Comparison with Other Solutions

### vs React Context

**Context Bridge:**
- Works with Server Components
- No runtime Context Provider overhead
- Data serialized once during SSR
- Cannot be updated on client (by design)

**React Context:**
- Only works in Client Components
- Requires Provider wrapper
- State can be updated
- Not compatible with Server Components

### vs Tanstack Query / SWR

**Context Bridge:**
- Zero runtime overhead
- Perfect for SSR data that doesn't change
- No cache management needed
- Simpler API

**Tanstack Query / SWR:**
- Client-side caching and revalidation
- Mutation support
- Loading/error states
- Better for dynamic data

## Use Cases

Context Bridge is perfect for:

- Passing user authentication data from server to client
- Sharing server-fetched configuration across components
- Providing initial data for client-side features
- Avoiding prop drilling in Server Component trees
- Sharing theme/locale data from server to client

Context Bridge is NOT suitable for:

- Data that needs to be updated on the client
- Real-time data that requires revalidation
- Complex state management with actions/reducers
- Data that contains functions or non-serializable objects

## Troubleshooting

### Hook returns default value

**Problem:** Client component always receives the default value.

**Solutions:**
1. Ensure `BridgeSerializer` is added to root layout
2. Check that Provider `bridgeId` matches hook `bridgeId`
3. Verify Provider wraps the component using the hook
4. Check browser DevTools for `__CONTEXT_BRIDGE_STORE__` script tag

### Serialization error

**Problem:** Error during build or runtime about serialization.

**Solutions:**
1. Ensure data is JSON-serializable (no functions, symbols, circular refs)
2. Convert Dates to strings: `createdAt: date.toISOString()`
3. Remove or transform non-serializable properties

### TypeScript errors

**Problem:** Type errors when using Provider or hook.

**Solutions:**
1. Ensure same type `T` is used for both Provider and hook
2. Check that `data` prop matches the defined type
3. Verify TypeScript version is 5.0 or higher

## Examples

### Next.js App Router Example

Complete example with authentication:

```typescript
// lib/auth-bridge.ts
import { createBridgeProvider } from '@tnnquang/context-bridge/server';
import { createBridgeHook } from '@tnnquang/context-bridge/client';

type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
} | null;

export const AuthProvider = createBridgeProvider<AuthUser>('auth');
export const useAuth = createBridgeHook<AuthUser>('auth', null);

// app/layout.tsx
import { BridgeSerializer } from '@tnnquang/context-bridge/server';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <BridgeSerializer />
      </body>
    </html>
  );
}

// app/page.tsx (Server Component)
import { AuthProvider } from '@/lib/auth-bridge';
import { getServerSession } from '@/lib/auth';
import { Header } from '@/components/header';

export default async function Page() {
  const user = await getServerSession();

  return (
    <AuthProvider data={user}>
      <Header />
      <main>
        {/* Your content */}
      </main>
    </AuthProvider>
  );
}

// components/header.tsx (Client Component)
'use client';

import { useAuth } from '@/lib/auth-bridge';

export function Header() {
  const user = useAuth();

  return (
    <header>
      {user ? (
        <div>
          <img src={user.avatar} alt={user.name} />
          <span>Welcome, {user.name}</span>
        </div>
      ) : (
        <a href="/login">Sign In</a>
      )}
    </header>
  );
}
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Repository

[https://github.com/tnnquang/context-bridge](https://github.com/tnnquang/context-bridge)

## Issues

[https://github.com/tnnquang/context-bridge/issues](https://github.com/tnnquang/context-bridge/issues)
