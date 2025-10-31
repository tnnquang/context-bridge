# Example Usage

This directory contains example code demonstrating how to use `context-bridge`.

## Files

- **user-bridge.tsx**: Defines a typed bridge for user data
- **ServerPage.tsx**: Server Component that fetches data and provides it via BridgeProvider
- **UserProfile.tsx**: Client Component that consumes the bridged data

## How it works

1. **Define the bridge** (`user-bridge.tsx`):
   - Define your data type
   - Create a bridge using `createBridge<T>()`
   - Export both `BridgeProvider` and `useBridge` hook

2. **Server Component** (`ServerPage.tsx`):
   - Fetch data asynchronously
   - Wrap Client Components with `BridgeProvider`
   - Pass data via the `data` prop

3. **Client Component** (`UserProfile.tsx`):
   - Mark component with `'use client'`
   - Call `useBridge()` to access the data
   - Use the data in your component

## Key Benefits

- No prop drilling through multiple component layers
- Type-safe data access with TypeScript
- Simple and lightweight approach
- Works seamlessly with React Server Components
