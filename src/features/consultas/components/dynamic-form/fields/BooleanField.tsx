import { useFormContext } from 'react-hook-form';
import { SchemaField } from '../../../types/schema-engine';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

interface BooleanFieldProps {
  field: SchemaField;
  name: string;
}

export function BooleanField({ field, name }: BooleanFieldProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: rhfField }) => (
        <FormItem className="flex min-h-24 items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4 transition-colors hover:border-emerald-200 hover:bg-emerald-50/50 dark:border-zinc-800 dark:bg-zinc-950/50 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/20">
          <div className="min-w-0">
            <FormLabel className="text-sm font-semibold leading-5 text-zinc-800 dark:text-zinc-100">
              {field.label}
            </FormLabel>
          </div>
          <FormControl>
            <Switch
              className="data-checked:bg-emerald-600"
              checked={!!rhfField.value}
              onCheckedChange={rhfField.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
