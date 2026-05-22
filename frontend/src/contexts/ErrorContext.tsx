import { createContext, type Dispatch, type SetStateAction } from 'react';

// Separate string state from open state or MUI Snackbar component
// will clear error text before closing, resulting in jank
export interface ErrorContextType {
  // Error message state
  error: string;

  // Error popup display state
  openError: boolean;
  setOpenError: Dispatch<SetStateAction<boolean>> | (() => void);

  // Function that displays the given error message
  showError: (_error: unknown) => void;
}

export const ErrorContext = createContext<ErrorContextType>({
  error: '',
  openError: false,
  setOpenError: () => {},
  showError: () => {}
});
