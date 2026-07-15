import { Box, TextField } from '@mui/material';
import { useTag } from '../../hooks/useTag';

// TODO: Create then use backend route for getting all tags and restrict user to selecting tags that exist
// Form that allows users to add filter tags to Shelf via text input
const ShelfTagField = () => {
  const [appendTag] = useTag();

  return (
    <>
      <Box
        component="form"
        onSubmit={(e) => {
          // Prevent full-page reload on submit
          e.preventDefault();

          const formData = new FormData(e.target);

          const tag = formData.get('tag')?.toString();
          if (!tag || !tag.trim()) return;
          appendTag(tag);

          e.target.reset();
        }}
        sx={{ width: '12%' }}
      >
        <TextField
          name="tag"
          label="Filter by Tags"
          size="small"
          variant="standard"
          sx={{
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'secondary.dark',
            },
          }}
        />
      </Box>
    </>
  );
};

export default ShelfTagField;
