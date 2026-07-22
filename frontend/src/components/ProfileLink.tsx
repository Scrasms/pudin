import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router';

// Inline link to the given user's profile page with optional label
const ProfileLink = ({
  uid,
  username,
  label,
}: {
  uid: string;
  username: string;
  label?: string;
}) => {
  const navigate = useNavigate();

  return (
    <>
      <Typography
        sx={{
          fontSize: {
            xs: '0.8rem',
            sm: '1rem',
          },
        }}
      >
        {label && (
          <Box component="span" sx={{ fontWeight: 500 }}>
            {label}
          </Box>
        )}

        <Box
          component="span"
          sx={{
            color: 'secondary.dark',
            '&:hover': {
              color: 'secondary.main',
            },
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
          onClick={(e) => {
            // Don't trigger onClick for parent components
            e.stopPropagation();
            navigate(`/${uid}`);
          }}
        >
          {username}
        </Box>
      </Typography>
    </>
  );
};

export default ProfileLink;
