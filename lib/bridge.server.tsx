// lib/context-bridge.server.ts
import { cache } from 'react';
import type { ReactNode } from 'react';

/**
 * 1. Request-Scoped Store (using React's 'cache')
 * We use `unknown` because this store contains multiple data types
 * from different bridges.
 */
const getRequestStore = cache(
  () => new Map<string, unknown>()
);

/**
 * 2. Component Serializer
 * Place this component in the root layout (at the end of <body>).
 * It will collect all data from Providers and embed it in a <script> tag.
 */
export function BridgeSerializer() {
  const store = getRequestStore();
  if (store.size === 0) {
    return null;
  }

  const data = Object.fromEntries(store);
  let jsonString: string;

  try {
    // Try to stringify the data
    jsonString = JSON.stringify(data);
  } catch (error) {
    // 🛑 HANDLE SERIALIZATION ERROR
    // This error occurs if data contains Circular References.
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'ContextBridge Error: Unable to serialize data.',
        error
      );
      // In dev environment, throw error so developers can fix it immediately
      throw new Error(
        'ContextBridge: Data cannot be serialized (possibly due to circular reference).'
      );
    }
    // In production environment, log error and render nothing
    console.error('ContextBridge: Serialization error', error);
    return null;
  }

  return (
    <script
      id="__CONTEXT_BRIDGE_STORE__"
      type="application/json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}

/**
 * 3. Create Provider (Server)
 * This function creates a specific Provider component.
 * @param bridgeId A unique string ID for the bridge
 */
export function createBridgeProvider<T>(bridgeId: string) {
  
  // This is the Server Component that users will use
  const Provider = ({
    data,
    children,
  }: {
    data: T; // <-- Type Safety here
    children: ReactNode;
  }) => {
    // 1. Check if data is serializable (only in dev)
    if (process.env.NODE_ENV === 'development') {
      if (
        data === undefined ||
        typeof data === 'function' ||
        typeof data === 'symbol'
      ) {
        console.warn(
          `ContextBridge Warning [${bridgeId}]: Data passed to Provider is 'undefined', 'function', or 'symbol'. 
          It will be lost during serialization. Data must be JSON-serializable.`
        );
      }
    }

    // 2. Store data in the store
    getRequestStore().set(bridgeId, data);
    return <>{children}</>;
  };

  return Provider;
}