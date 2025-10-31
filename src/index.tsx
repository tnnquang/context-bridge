'use client';

import { createContext, useContext, ReactNode } from 'react';

/**
 * Creates a bridge for passing data from Server Components to Client Components
 * @returns An object containing BridgeProvider and useBridge hook
 */
export function createBridge<T>() {
  const BridgeContext = createContext<T | undefined>(undefined);

  /**
   * Provider component to wrap Client Components and pass data from Server Components
   */
  function BridgeProvider({ 
    children, 
    data 
  }: { 
    children: ReactNode; 
    data: T 
  }) {
    return (
      <BridgeContext.Provider value={data}>
        {children}
      </BridgeContext.Provider>
    );
  }

  /**
   * Hook to access the bridged data in Client Components
   */
  function useBridge(): T {
    const context = useContext(BridgeContext);
    if (context === undefined) {
      throw new Error('useBridge must be used within a BridgeProvider');
    }
    return context;
  }

  return {
    BridgeProvider,
    useBridge
  };
}
