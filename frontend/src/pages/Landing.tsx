import { Box } from '@mui/material';
import Form from '../components/Forms/Form';
import Input from '../components/Forms/Input';
import LandingLayout from '../components/Layouts/LandingLayout';

const Landing = () => {

  return (
    <>
      <LandingLayout>
        <Box sx={{ width: '450px' }}>
          <Form title="Login" onSubmit={() => {}}>
            <Input name="username" label="Username" required />
            <Input type="password" name="password" label="Password" required />
          </Form>
        </Box>
      </LandingLayout>
    </>
  );
};

export default Landing;
