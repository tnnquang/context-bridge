// Example: Server Component that fetches and provides data
import { UserBridgeProvider } from './user-bridge';
import UserProfile from './UserProfile';

// Simulated async data fetching (in real app, this could be from database, API, etc.)
async function getUserData() {
  return {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin'
  };
}

export default async function ServerPage() {
  // Fetch data in Server Component
  const userData = await getUserData();
  
  // Pass data to Client Components via BridgeProvider
  return (
    <UserBridgeProvider data={userData}>
      <div>
        <h1>User Dashboard</h1>
        <UserProfile />
      </div>
    </UserBridgeProvider>
  );
}
