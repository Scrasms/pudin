import { useEffect, useState, type ReactNode } from 'react';
import { UserContext } from './UserContext';
import { apiCall } from '../utils/api';

// Provider for UserContext
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch user's id on mount from backend
  useEffect(() => {
    const refreshId = async () => {
      const data = await apiCall('user/id', 'GET');
      setUid(data.uid);

      setLoading(false);
    };
    refreshId();
  }, []);

  return (
    <>
      <UserContext.Provider value={{ uid, setUid, loading }}>
        {children}
      </UserContext.Provider>
    </>
  );
};
