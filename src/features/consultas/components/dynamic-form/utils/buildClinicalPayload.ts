import { ClinicalSchema } from '../../../types/schema-engine';
import { ClinicalField } from '../../../schemas/consulta-schema';

type RawFormValues = Record<string, Record<string, { answer?: unknown } | undefined> | undefined>;

export type ClinicalPayload = Record<string, Record<string, ClinicalField>>;

export function buildClinicalPayload(
  schema: ClinicalSchema,
  values: RawFormValues
): ClinicalPayload {
  return schema.sections.reduce<ClinicalPayload>((sectionAcc, section) => {
    sectionAcc[section.id] = section.fields.reduce<Record<string, ClinicalField>>((fieldAcc, field) => {
      const fieldValue = values[section.id]?.[field.id];

      fieldAcc[field.id] = {
        id: field.id,
        question: field.label,
        answer: fieldValue?.answer ?? null,
        type: field.type,
        labels: field.tags,
      };

      return fieldAcc;
    }, {});

    return sectionAcc;
  }, {});
}
