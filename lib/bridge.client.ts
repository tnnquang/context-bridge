// lib/context-bridge.client.ts
'use client';

import { useMemo } from 'react';

// Global store on the client side
let clientStore: Record<string, unknown> | null = null;

/**
 * 1. Data Hydrator Function
 * Reads data from <script> tag and parses it (runs only once).
 */
function getHydratedStore(): Record<string, unknown> {
  if (clientStore) {
    return clientStore;
  }

  if (typeof window === 'undefined') {
    // Safety: If running on server (e.g., first re-render),
    // return empty store. Hook will use defaultValue.
    return {};
  }

  try {
    const script = document.getElementById(
      '__CONTEXT_BRIDGE_STORE__'
    );
    if (script && script.textContent) {
      clientStore = JSON.parse(script.textContent);
      return clientStore || {};
    }
  } catch (e) {
    console.error(
      'ContextBridge Error: Unable to parse data from server.',
      e
    );
  }

  clientStore = {};
  return clientStore;
}

/**
 * 2. Create Hook (Client)
 * This function creates a specific hook to read data.
 * @param bridgeId Unique string ID (must match server)
 * @param defaultValue Default value if data is not found
 */
export function createBridgeHook<T>(
  bridgeId: string,
  defaultValue: T
) {
  
  // This is the Client Hook that users will use
  const useBridgeData = (): T => {
    // useMemo ensures we only read the store once
    const store = useMemo(() => getHydratedStore(), []);

    const data = store[bridgeId];

    if (data !== undefined) {
      // We trust that the server sent the correct type T
      return data as T;
    }

    return defaultValue;
  };

  return useBridgeData;
}