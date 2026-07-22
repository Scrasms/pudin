import type { Theme } from '@emotion/react';
import { Button, Chip, Stack, type SxProps } from '@mui/material';
import { useState } from 'react';

// Displays the given tags in a flex list with optional callbacks
const TagList = ({
  tags,
  onClick,
  onDelete,
  sx,
  maxDisplayed = tags.length,
}: {
  tags: Array<string>;
  onClick?: (_: string) => void;
  onDelete?: (_: string) => void;
  sx?: SxProps<Theme>;
  maxDisplayed?: number; // how many tags can be displayed at once
}) => {
  const [hide, setHide] = useState(true);
  const showHide = maxDisplayed < tags.length;
  const numToShow = hide ? maxDisplayed : tags.length;

  return (
    <>
      <Stack direction="row" useFlexGap spacing={1} sx={sx}>
        {tags.map(
          (tag, index) =>
            index < numToShow && (
              <Chip
                key={index}
                label={tag}
                sx={{ fontWeight: 600 }}
                clickable={onClick !== undefined}
                {...(onClick && { onClick: () => onClick(tag) })}
                {...(onDelete && { onDelete: () => onDelete(tag) })}
              />
            ),
        )}

        {showHide && (
          <Button color="secondary" onClick={() => setHide((prev) => !prev)}>
            {hide ? 'Show' : 'Hide'}
          </Button>
        )}
      </Stack>
    </>
  );
};

export default TagList;
