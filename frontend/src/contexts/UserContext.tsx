import { createContext, type Dispatch, type SetStateAction } from 'react';

export interface UserContextType {
  // User's backend id stored as react state
  uid: string;
  setUid: Dispatch<SetStateAction<string>> | (() => void);

  // Whether the user info is still loading from backend or not
  loading: boolean;
}

// Context storing user information
export const UserContext = createContext<UserContextType>({
  uid: '',
  setUid: () => {},
  loading: true
});
