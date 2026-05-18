import { useFormContext } from 'react-hook-form';
import { SchemaField } from '../../../types/schema-engine';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

interface MultiChoiceFieldProps {
  field: SchemaField;
  name: string;
}

export function MultiChoiceField({ field, name }: MultiChoiceFieldProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className="space-y-3">
          <div className="mb-3">
            <FormLabel className="text-sm font-semibold leading-5 text-zinc-800 dark:text-zinc-100">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </FormLabel>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {field.options?.map((option) => (
              <FormField
                key={option.value.toString()}
                control={control}
                name={name}
                render={({ field: rhfField }) => {
                  // Garante que o valor inicial seja um array
                  const currentValue = Array.isArray(rhfField.value) ? rhfField.value : [];
                  
                  return (
                    <FormItem className="flex min-h-12 flex-row items-center gap-3 space-y-0 rounded-xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 shadow-none transition-colors hover:border-emerald-200 hover:bg-emerald-50/50 dark:border-zinc-800 dark:bg-zinc-950/50 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/20">
                      <FormControl>
                        <Checkbox
                          className="data-checked:border-emerald-600 data-checked:bg-emerald-600"
                          checked={currentValue.includes(option.value)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? rhfField.onChange([...currentValue, option.value])
                              : rhfField.onChange(
                                  currentValue.filter((value: unknown) => value !== option.value)
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="w-full flex-1 cursor-pointer text-sm font-medium leading-5 text-zinc-700 dark:text-zinc-200">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
