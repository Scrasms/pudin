import Form from '../components/Forms/Form';
import Input from '../components/Forms/Input';
import { useNavigate } from 'react-router';
import { apiCall } from '../utils/api';
import { useContext } from 'react';
import { ErrorContext } from '../contexts/ErrorContext';
import { UserContext } from '../contexts/UserContext';
import LandingLayout from '../components/Layouts/LandingLayout';

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const navigate = useNavigate();
  const { showError, openError, setOpenError } = useContext(ErrorContext);
  const { setUser } = useContext(UserContext);

  const submitRegister = async (formData: RegisterFormValues) => {
    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Both passwords must match');
      }

      const data = await apiCall('user/signup', 'POST', formData);
      setUser((user) => (user!.uid = data.uid));

      if (openError) setOpenError(false);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      showError(error);
    }
  };

  return (
    <>
      <LandingLayout>
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
      </LandingLayout>
    </>
  );
};

export default Register;
