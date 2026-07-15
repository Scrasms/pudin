import { Chip, Stack } from '@mui/material';

// Displays first 5 tags (chronologically) of the book in a scrollable horizontal container
const ShelfTags = ({ tags }: { tags: Array<string> }) => {
  const truncTags = tags.slice(0, 5);

  return (
    <>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          height: '50px',
          alignItems: 'center',
          overflowY: 'hidden',
          overflowX: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(155, 155, 155, 0.5) transparent',
        }}
      >
        {truncTags.map((tag, index) => (
          <Chip key={index} label={tag} sx={{ fontWeight: 600 }} />
        ))}
      </Stack>
    </>
  );
};

export default ShelfTags;
