import { useFormContext } from 'react-hook-form';
import { SchemaField } from '../../../types/schema-engine';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TextFieldProps {
  field: SchemaField;
  name: string;
}

export function TextField({ field, name }: TextFieldProps) {
  const { control } = useFormContext();
  const isTextarea = field.type === 'textarea';
  const isNumber = field.type === 'number';

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: rhfField }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-sm font-semibold leading-5 text-zinc-800 dark:text-zinc-100">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            {isTextarea ? (
              <Textarea 
                placeholder={field.placeholder} 
                className="min-h-32 resize-none rounded-2xl border-zinc-200 bg-zinc-50/70 px-4 py-3 text-sm leading-6 shadow-none focus-visible:border-emerald-400 focus-visible:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950/60" 
                {...rhfField} 
                value={rhfField.value || ''}
              />
            ) : (
              <Input 
                type={isNumber ? 'number' : 'text'} 
                placeholder={field.placeholder} 
                className="h-11 rounded-xl border-zinc-200 bg-zinc-50/70 px-4 text-sm shadow-none focus-visible:border-emerald-400 focus-visible:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950/60"
                {...rhfField} 
                value={rhfField.value || ''}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
