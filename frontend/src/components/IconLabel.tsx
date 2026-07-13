import { Stack, SvgIcon, Typography, type SvgIconProps } from '@mui/material';
import type { ElementType } from 'react';

// Adds the given label text to an MUI icon
const IconLabel = ({
  icon,
  label,
  bottom,
  iconProps,
}: {
  icon: ElementType;
  label: string | number;
  bottom?: boolean;
  iconProps?: Omit<SvgIconProps, 'component'>;
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
        <SvgIcon component={icon} {...iconProps} />
        <Typography>{label}</Typography>
      </Stack>
    </>
  );
};

export default IconLabel;
