import { Alert, AlertTitle, Snackbar, Typography } from '@mui/material';
import { useContext } from 'react';
import { ErrorContext } from '../contexts/ErrorContext';

// Error popup that displays when an error message is provided
const ErrorPopup = () => {
  const { error, openError, setOpenError } = useContext(ErrorContext);

  return (
    <>
      <Snackbar
        open={openError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={(_, reason) => {
          // Don't close if popup loses focus
          if (reason !== 'clickaway') setOpenError(false);
        }}
      >
        <Alert severity="error" onClose={() => setOpenError(false)}>
          <AlertTitle variant="h5">Error</AlertTitle>
          <Typography variant="h6">{error}</Typography>
        </Alert>
      </Snackbar>
    </>
  );
};

export default ErrorPopup;
