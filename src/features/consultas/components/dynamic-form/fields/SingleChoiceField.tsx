import { useFormContext } from 'react-hook-form';
import { SchemaField } from '../../../types/schema-engine';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SingleChoiceFieldProps {
  field: SchemaField;
  name: string;
}

export function SingleChoiceField({ field, name }: SingleChoiceFieldProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: rhfField }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-sm font-semibold leading-5 text-zinc-800 dark:text-zinc-100">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </FormLabel>
          <Select
            value={rhfField.value === undefined ? undefined : String(rhfField.value)}
            onValueChange={rhfField.onChange}
          >
            <FormControl>
              <SelectTrigger className="h-11 w-full rounded-xl border-zinc-200 bg-zinc-50/70 px-4 text-sm shadow-none focus-visible:border-emerald-400 focus-visible:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950/60">
                <SelectValue placeholder={field.placeholder || 'Selecionar'} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={String(option.value)} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
