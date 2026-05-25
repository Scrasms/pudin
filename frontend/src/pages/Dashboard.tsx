import { Typography } from '@mui/material';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

const Dashboard = () => {
  const { uid } = useContext(UserContext);

  return (
    <>
      <Typography variant="h1" sx={{ color: 'secondary.main' }}>
        Hi {uid}
      </Typography>
    </>
  );
};

export default Dashboard;
