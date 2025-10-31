// Example: Creating a bridge for user data
import { createBridge } from '../src/index';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Create a typed bridge for user data
export const { 
  BridgeProvider: UserBridgeProvider, 
  useBridge: useUserBridge 
} = createBridge<UserData>();
