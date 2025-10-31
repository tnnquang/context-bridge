// Example: Client Component that uses the bridged data
'use client';

import { useUserBridge } from './user-bridge';

export default function UserProfile() {
  // Access the data passed from Server Component
  const user = useUserBridge();
  
  return (
    <div>
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>ID:</strong> {user.id}</p>
    </div>
  );
}
