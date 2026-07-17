import { Box, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSearchParams } from 'react-router';
import { useState } from 'react';

// TODO: implement search by user by creating a new Dashboard-like page that refreshes users instead
// Uncontrolled search bar for searching books and users
const SearchBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // User's input into searchbar
  const [search, setSearch] = useState(searchParams.get('search'));

  return (
    <>
      <Box
        component="form"
        onSubmit={(e) => {
          // Prevent full-page reload on submit
          e.preventDefault();

          const formData = new FormData(e.target);

          // Block searching for spaces only
          const search = formData.get('search')?.toString();
          if (!search || !search.trim()) return;
          setSearchParams((prev) => {
            prev.set('search', search);
            return prev;
          });

          e.target.reset();
        }}
        sx={{
          width: {
            xs: '50%',
            md: '30%',
          },
        }}
      >
        <TextField
          name="search"
          aria-label="search"
          hiddenLabel
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root': {
              bgcolor: 'primary.main',
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
    </>
  );
};

export default SearchBar;
