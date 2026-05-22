import { useState, type ReactNode } from 'react';
import { ErrorContext } from './ErrorContext';
import ErrorPopup from '../components/ErrorPopup';

// Provider for ErrorContext that also places a ErrorPopup after its children
export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState('');
  const [openError, setOpenError] = useState(false);

  // Displays the given error
  const showError = (error: unknown) => {
    if (error instanceof Error) {
      setError(error.message);
      setOpenError(true);
    }
    // TODO: remove in prod
    console.log(error);
  };

  return (
    <>
      <ErrorContext.Provider
        value={{ error, openError, setOpenError, showError }}
      >
        {children}
        <ErrorPopup />
      </ErrorContext.Provider>
    </>
  );
};
