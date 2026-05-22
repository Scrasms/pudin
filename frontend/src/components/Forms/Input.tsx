import { TextField, type TextFieldProps } from '@mui/material';
import {
  useFormContext,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form';

export interface InputProps<T extends FieldValues> {
  name: Path<T>;
  type?: string;
  label?: string;
  palette?: 'primary' | 'secondary';
  required?: boolean;
  textFieldProps?: Omit<TextFieldProps, 'sx'>;
}

// Wrapper around MUI TextField that supports input validation via React Hook Form
const Input = <T extends FieldValues>({
  type,
  label,
  name,
  palette,
  required,
  textFieldProps,
}: InputProps<T>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const registerOptions: RegisterOptions<T, Path<T>> = {};
  if (required) {
    registerOptions.required = `${label} is required`;
  }

  return (
    <TextField
      {...register(name, registerOptions)}
      type={type}
      label={label}
      error={errors[name] !== undefined}
      helperText={errors[name]?.message as string}
      color={palette || 'secondary'}
      {...textFieldProps}
      sx={{ width: '100%' }}
    />
  );
};

export default Input;
