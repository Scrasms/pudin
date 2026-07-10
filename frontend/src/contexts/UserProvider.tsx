import { useEffect, useState, type ReactNode } from 'react';
import { UserContext } from './UserContext';
import { apiCall } from '../utils/api';
import type { User } from '../utils/types';

// Provider for UserContext
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const data = await apiCall('user/me', 'GET');
      setUser(data);
    } catch {
      setUser(undefined);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch user data on mount from backend
  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <>
      <UserContext.Provider value={{ user, setUser, loading }}>
        {children}
      </UserContext.Provider>
    </>
  );
};
