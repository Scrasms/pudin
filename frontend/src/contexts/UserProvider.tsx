import { useEffect, useState, type ReactNode } from 'react';
import { UserContext } from './UserContext';
import { apiCall } from '../utils/api';

export interface User {
  uid: string;
  username: string;
  image: string;
  joinedAt: string;
}

// Provider for UserContext
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  // Fetch user's id on mount from backend
  useEffect(() => {
    const refreshId = async () => {
      const data = await apiCall('user/me', 'GET');
      setUser(data);

      setLoading(false);
    };
    refreshId();
  }, []);

  return (
    <>
      <UserContext.Provider value={{ user, setUser, loading }}>
        {children}
      </UserContext.Provider>
    </>
  );
};
