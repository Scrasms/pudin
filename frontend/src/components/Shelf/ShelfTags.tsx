import { Chip, Stack } from '@mui/material';
import { useTag } from '../../hooks/useTag';

// Displays first 5 tags (chronologically) of the book in a scrollable horizontal container
const ShelfTags = ({ tags }: { tags: Array<string> }) => {
  const truncTags = tags.slice(0, 5);
  const [appendTag] = useTag();

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
          <Chip
            key={index}
            label={tag}
            sx={{ fontWeight: 600 }}
            clickable
            onClick={() => appendTag(tag)}
          />
        ))}
      </Stack>
    </>
  );
};

export default ShelfTags;
