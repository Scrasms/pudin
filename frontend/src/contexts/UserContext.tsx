import { createContext, type Dispatch, type SetStateAction } from 'react';
import type { User } from '../utils/types';

export interface UserContextType {
  // User's info stored as object in react state
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>> | (() => void);

  // Whether the user info is still loading from backend or not
  loading: boolean;
}

// Context storing user information
export const UserContext = createContext<UserContextType>({
  user: undefined,
  setUser: () => {},
  loading: true
});
