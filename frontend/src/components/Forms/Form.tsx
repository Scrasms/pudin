import { Button, Paper, Typography } from '@mui/material';
import {
  FormProvider,
  useForm,
  type FieldValues,
  type SubmitHandler,
} from 'react-hook-form';
import { type ReactNode } from 'react';

export interface FormProps<T extends FieldValues> {
  title: string;
  palette?: 'primary' | 'secondary';
  hideBackground?: boolean;
  submitText?: string;
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
}

// Form that includes a submit button and uses React Hook Form to handle submits
const Form = <T extends FieldValues>({
  title,
  palette,
  hideBackground,
  submitText,
  onSubmit,
  children,
}: FormProps<T>) => {
  const methods = useForm<T>();

  return (
    <>
      <FormProvider {...methods}>
        <Paper
          component="form"
          elevation={10}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            minHeight: '40%',
            minWidth: '40%',
            borderRadius: 5,
            p: {
              xs: 2,
              md: 5,
            },
            backgroundColor: hideBackground ? 'transparent' : '',
            boxShadow: hideBackground ? 'none' : '',
          }}
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <Typography
            sx={{ color: palette ? `${palette}.main` : 'secondary.main' }}
            variant="h3"
          >
            {title}
          </Typography>

          {children}

          <Button
            variant="contained"
            color={palette || 'secondary'}
            type="submit"
          >
            {submitText || title}
          </Button>
        </Paper>
      </FormProvider>
    </>
  );
};

export default Form;
