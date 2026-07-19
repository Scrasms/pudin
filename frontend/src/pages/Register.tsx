import Form from '../components/Forms/Form';
import Input from '../components/Forms/Input';
import { useNavigate } from 'react-router';
import { apiCall } from '../utils/api';
import { useContext, useState } from 'react';
import { ErrorContext } from '../contexts/ErrorContext';
import { UserContext } from '../contexts/UserContext';
import LandingLayout from '../components/Layouts/LandingLayout';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Register page
const Register = () => {
  const navigate = useNavigate();
  const { showError, openError, setOpenError } = useContext(ErrorContext);
  const { setUser } = useContext(UserContext);
  const [codes, setCodes] = useState<Array<string>>();
  const [checked, setChecked] = useState(false);

  const submitRegister = async (formData: RegisterFormValues) => {
    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Both passwords must match');
      }

      const data = await apiCall('user/signup', 'POST', formData);

      setCodes(data.codes);
      delete data.codes;

      setUser(data);
    } catch (error) {
      showError(error);
    }
  };

  return (
    <>
      <LandingLayout>
        {!codes && (
          <Form title="Register" onSubmit={submitRegister}>
            <Input name="username" label="Username" required />
            <Input type="email" name="email" label="Email" required />
            <Input type="password" name="password" label="Password" required />
            <Input
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              required
            />
          </Form>
        )}

        {codes && (
          <>
            <Stack sx={{ alignItems: 'center' }} spacing={2}>
              <Typography
                variant="h3"
                sx={{ color: '#da3131', textAlign: 'justify', width: '60%' }}
              >
                IMPORTANT: Reset Codes
              </Typography>

              <Typography
                variant="h5"
                sx={{ textAlign: 'justify', fontWeight: 'bold', width: '60%' }}
              >
                Please make a note of these codes as they will be required when
                changing your password.
              </Typography>

              <Typography
                variant="h5"
                sx={{ textAlign: 'justify', fontWeight: 'bold', width: '60%' }}
              >
                Each code may only be used once.
              </Typography>

              <Typography
                variant="h5"
                sx={{ textAlign: 'justify', fontWeight: 'bold', width: '60%' }}
              >
                These codes will NOT be displayed again.
              </Typography>

              <Grid container spacing={2} columns={3} sx={{ mt: 2 }}>
                {codes.map((code, index) => (
                  <Grid
                    key={index}
                    size={1}
                    sx={{ textAlign: 'center', border: '2px solid black' }}
                  >
                    <Typography sx={{ fontSize: '2.5rem' }}>{code}</Typography>
                  </Grid>
                ))}
              </Grid>

              <FormControlLabel
                label="I have recorded these codes in a secure place"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontWeight: 'bold',
                  },
                }}
                control={
                  <Checkbox
                    checked={checked}
                    onChange={() => setChecked((checked) => !checked)}
                    color="secondary"
                  />
                }
              />
              <Button
                variant="contained"
                loading={!checked}
                color="secondary"
                size="large"
                sx={{ mt: 2 }}
                onClick={() => {
                  if (openError) setOpenError(false);
                  navigate('/dashboard', { replace: true });
                }}
              >
                Continue
              </Button>
            </Stack>
          </>
        )}
      </LandingLayout>
    </>
  );
};

export default Register;
