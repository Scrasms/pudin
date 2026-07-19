import Form from '../components/Forms/Form';
import Input from '../components/Forms/Input';
import { useNavigate } from 'react-router';
import { apiCall } from '../utils/api';
import { useContext } from 'react';
import { ErrorContext } from '../contexts/ErrorContext';
import { UserContext } from '../contexts/UserContext';
import LandingLayout from '../components/Layouts/LandingLayout';

interface LoginFormValues {
  username: string;
  password: string;
}

// Login page
const Login = () => {
  const navigate = useNavigate();
  const { showError, openError, setOpenError } = useContext(ErrorContext);
  const { setUser } = useContext(UserContext);

  const submitLogin = async (formData: LoginFormValues) => {
    try {
      const data = await apiCall('user/login', 'POST', formData);
      setUser(data);

      if (openError) setOpenError(false);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      showError(error);
    }
  };

  return (
    <>
      <LandingLayout>
        <Form title="Login" onSubmit={submitLogin}>
          <Input name="username" label="Username" required />
          <Input type="password" name="password" label="Password" required />
        </Form>
      </LandingLayout>
    </>
  );
};

export default Login;
