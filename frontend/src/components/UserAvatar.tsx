import { Avatar } from '@mui/material';

// Displays provided user's avatar image or defaults to first letter of username
const UserAvatar = ({
  username,
  image,
}: {
  username: string;
  image: string;
}) => {
  return (
    <>
      {image ? (
        <Avatar src={image} alt={`${username}'s profile picture`} />
      ) : (
        <Avatar>{username?.at(0)?.toUpperCase()}</Avatar>
      )}
    </>
  );
};

export default UserAvatar;
