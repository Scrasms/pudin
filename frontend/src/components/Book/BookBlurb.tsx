import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// Displays the provided blurb in an accordion
const BookBlurb = ({ blurb }: { blurb: string }) => {
  return (
    <>
      <Accordion sx={{ bgcolor: '#6d6c6c', width: '100%' }} defaultExpanded>
        <AccordionSummary
          id="blurb-header"
          aria-controls="blurb-content"
          expandIcon={<ArrowDropDownIcon />}
        >
          <Typography component="span" sx={{ color: 'white' }}>
            Blurb
          </Typography>
        </AccordionSummary>

        <AccordionDetails id="blurb-content" sx={{ bgcolor: '#e0e0e0' }}>
          <Typography
            component="pre"
            sx={{
              fontSize: {
                xs: '0.8rem',
                md: '1rem',
              },
              whiteSpace: 'pre-wrap',
              overflow: 'scroll',
            }}
          >
            {blurb}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default BookBlurb;
