# context-bridge

A connector to get data from Server Component and use it in Client Component instead of React Context. This is a super lightweight library, no need to use Tanstack Query or similar libraries.

## Installation

```bash
npm install context-bridge
```

## Usage

### 1. Create a bridge

First, create a bridge in a separate file. This creates a typed connection between your Server and Client Components.

```typescript
// lib/user-bridge.ts
import { createBridge } from 'context-bridge';

export interface UserData {
  id: string;
  name: string;
  email: string;
}

export const { BridgeProvider: UserBridgeProvider, useBridge: useUserBridge } = createBridge<UserData>();
```

### 2. Use in Server Component

In your Server Component, fetch data and pass it to the BridgeProvider:

```typescript
// app/page.tsx (Server Component)
import { UserBridgeProvider } from '@/lib/user-bridge';
import UserProfile from '@/components/UserProfile';

async function getUserData() {
  // Fetch data from database, API, etc.
  return {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com'
  };
}

export default async function Page() {
  const userData = await getUserData();
  
  return (
    <UserBridgeProvider data={userData}>
      <UserProfile />
    </UserBridgeProvider>
  );
}
```

### 3. Access data in Client Component

In your Client Component, use the bridge hook to access the data:

```typescript
// components/UserProfile.tsx
'use client';

import { useUserBridge } from '@/lib/user-bridge';

export default function UserProfile() {
  const user = useUserBridge();
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

## Benefits

- **Lightweight**: No external dependencies except React
- **Type-safe**: Full TypeScript support with type inference
- **Simple**: No complex setup or configuration needed
- **Server Component friendly**: Designed specifically for React Server Components
- **No prop drilling**: Access data anywhere within the provider tree

## API

### `createBridge<T>()`

Creates a new bridge for passing data of type `T`.

**Returns:**
- `BridgeProvider`: A React component that accepts `data` and `children` props
- `useBridge`: A React hook that returns the bridged data

**Example:**
```typescript
const { BridgeProvider, useBridge } = createBridge<MyDataType>();
```

## License

MIT
