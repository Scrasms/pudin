import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import type { ReactNode } from 'react';

// Wrapper around MUI Accordian styled specifically for the Book page
const BookAccordion = ({
  name,
  summary,
  children,
  disableDetailsGutters=false,
}: {
  name: string;
  summary: string;
  children: ReactNode;
  disableDetailsGutters?: boolean;
}) => {
  return (
    <>
      <Accordion
        component="section"
        sx={{ bgcolor: '#6d6c6c', width: '100%' }}
        defaultExpanded
        disableGutters
      >
        <AccordionSummary
          id={`${name}-header`}
          aria-controls={`${name}-content`}
          expandIcon={<ArrowDropDownIcon />}
        >
          <Typography component="span" sx={{ color: 'white' }}>
            {summary}
          </Typography>
        </AccordionSummary>

        <AccordionDetails
          id={`${name}-content`}
          sx={{ bgcolor: '#e0e0e0', p: disableDetailsGutters ? 0 : '16px' }}
        >
          {children}
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default BookAccordion;
