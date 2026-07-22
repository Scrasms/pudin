import type { Theme } from '@emotion/react';
import { Avatar, type SxProps } from '@mui/material';

// Displays provided user's avatar image or the default avatar
const UserAvatar = ({
  username,
  image,
  sx,
}: {
  username: string;
  image: string;
  sx?: SxProps<Theme>
}) => {
  return (
    <>
      <Avatar
        {...(image && { src: image, alt: `${username}'s profile picture` })}
        sx={sx}
      />
    </>
  );
};

export default UserAvatar;
