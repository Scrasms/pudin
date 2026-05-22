import { Box } from '@mui/material';
import Form from '../components/Forms/Form';
import Input from '../components/Forms/Input';
import LandingLayout from '../components/Layouts/LandingLayout';
import { useNavigate } from 'react-router';
import { apiCall } from '../utils/api';
import { useContext } from 'react';
import { ErrorContext } from '../contexts/ErrorContext';

interface LoginFormValues {
  username: string,
  password: string
}

const Landing = () => {
  const navigate = useNavigate();
  const { showError, openError, setOpenError } = useContext(ErrorContext);

  const submitLogin = async (formData: LoginFormValues) => {
    try {
      const data = await apiCall('user/login', 'POST', formData);

      console.log(data)

      if (openError) setOpenError(false);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      showError(error);
    }
  };

  return (
    <>
      <LandingLayout>
        <Box sx={{ width: '450px' }}>
          <Form title="Login" onSubmit={submitLogin}>
            <Input name="username" label="Username" required />
            <Input type="password" name="password" label="Password" required />
          </Form>
        </Box>
      </LandingLayout>
    </>
  );
};

export default Landing;
