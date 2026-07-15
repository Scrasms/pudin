import { MenuItem, TextField } from '@mui/material';
import { type Dispatch, type SetStateAction } from 'react';
import type { Option } from '../../utils/types';

// Basic controlled selector input for shelf 
const ShelfSelect = ({
  label,
  value,
  setValue,
  options,
}: {
  label: string;
  value: string | number;
  setValue:
    | Dispatch<SetStateAction<string | number>>
    | ((_value: string | number) => void);
  options: Array<Option>;
}) => {
  return (
    <>
      <TextField
        id={label.toLowerCase().replaceAll(' ', '-') + '-select'}
        select
        label={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        color="secondary"
        variant="standard"
        size="small"
        sx={{
          '& .MuiInputLabel-root.Mui-focused, & .MuiSvgIcon-root': {
            color: 'secondary.dark',
          },
        }}
        slotProps={{
          select: {
            MenuProps: {
              slotProps: {
                paper: {
                  sx: {
                    bgcolor: 'secondary.main',
                  },
                },
              },
            },
          },
        }}
      >
        {options.map((opt, index) => (
          <MenuItem
            key={index}
            value={opt.value}
            sx={{
              color: 'white',
              bgcolor: 'secondary.main',
              '&:hover, &.Mui-selected, &.Mui-selected:hover': {
                bgcolor: 'secondary.dark',
              },
            }}
          >
            {opt.label}
          </MenuItem>
        ))}
      </TextField>
    </>
  );
};

export default ShelfSelect;
