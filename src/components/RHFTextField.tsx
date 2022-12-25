import { TextField, TextFieldProps } from '@mui/material'
import { Controller, Control, FieldValues, Path } from 'react-hook-form'

export type RHFTextFieldProps<T extends FieldValues> =
  & Omit<TextFieldProps, 'name' | 'error' | 'helperText'>
  & {
    name: Path<T>
    control: Control<T>
  }

export function RHFTextField<T extends FieldValues>({ control, name, ...props }: RHFTextFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...props}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
        />
      )}
    />
  )
}
