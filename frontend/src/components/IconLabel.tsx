import type { Theme } from '@emotion/react';
import { Stack, SvgIcon, Typography, type SxProps } from '@mui/material';
import type { ElementType } from 'react';

// Adds the given label text to an MUI icon
const IconLabel = ({
  icon,
  label,
  bottom,
  iconSx,
  textSx,
}: {
  icon: ElementType;
  label: string | number;
  bottom?: boolean;
  iconSx?: SxProps<Theme>;
  textSx?: SxProps<Theme>;
}) => {
  let dir: 'row' | 'column' = 'row';
  if (bottom) {
    dir = 'column';
  }

  return (
    <>
      <Stack
        direction={dir}
        sx={{ gap: '0.3rem', justifyContent: 'center', alignItems: 'center' }}
      >
        <SvgIcon component={icon} sx={iconSx} />
        <Typography sx={textSx}>{label}</Typography>
      </Stack>
    </>
  );
};

export default IconLabel;
