import { Box, IconButton, Stack } from '@mui/material';
import ShelfTagField from './ShelfTagField';
import ShelfSelect from './ShelfSelect';
import { useSearchParams } from 'react-router';
import { useTag } from '../../hooks/useTag';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import type { Dispatch, SetStateAction } from 'react';
import { limits, orders } from '../../utils/options';
import TagList from '../TagList';

// Toolbar that manages the shelf's various filter and sort options
const ShelfToolbar = ({
  limit,
  order,
  tags,
  setAsc,
}: {
  limit: number;
  order: string;
  tags: Array<string>;
  setAsc: Dispatch<SetStateAction<boolean>>;
}) => {
  const [, setSearchParams] = useSearchParams();
  const [, removeTag] = useTag();

  // Also resets page back to 1 to avoid showing empty pages
  const handleLimitChange = (value: string | number) => {
    setSearchParams((prev) => {
      prev.set('show', value.toString());
      prev.set('page', '1');
      return prev;
    });
  };

  // Also resets page back to 1 to avoid confusion
  const handleOrderChange = (value: string | number) => {
    setSearchParams((prev) => {
      prev.set('sortBy', value.toString());
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <>
      <Box sx={{ p: '0px 20px' }}>
        <Stack
          direction="row"
          sx={{
            justifyContent: 'space-between',
          }}
        >
          <ShelfTagField />

          <Stack direction="row" spacing={2} sx={{ ml: 'auto' }}>
            <ShelfSelect
              label="Show"
              value={limit}
              setValue={handleLimitChange}
              options={limits}
            />

            <ShelfSelect
              label="Sort by"
              value={order as string}
              setValue={handleOrderChange}
              options={orders}
            />

            <IconButton
              aria-label="swap order"
              onClick={() => setAsc((asc) => !asc)}
            >
              <SwapVertIcon sx={{ color: 'secondary.dark' }} />
            </IconButton>
          </Stack>
        </Stack>

        {tags.length > 0 && (
          <TagList
            tags={tags}
            onDelete={removeTag}
            sx={{
              mr: 'auto',
              height: '50px',
              width: '100%',
              mt: '5px',
              alignItems: 'center',
              overflowY: 'hidden',
              overflowX: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(155, 155, 155, 0.5) transparent',
            }}
          />
        )}
      </Box>
    </>
  );
};

export default ShelfToolbar;
