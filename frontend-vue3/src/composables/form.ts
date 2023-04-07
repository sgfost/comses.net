import { toRef } from "vue";
import type { WritableComputedRef } from "vue";
import { yupResolver } from "@vorms/resolvers/yup";
import { useField as useVField, useForm as useVForm, type UseFormOptions } from "@vorms/core";

export function useField<T>(props: any, fieldNameProp: string="name") {
  /**
   * Wrapper for @vorms/core useField that provides a unique id for the field
   * Also takes care of converting to a ref
   */

  const nameRef = toRef(props, fieldNameProp);
  const field = useVField(nameRef);
  const value = field.value as WritableComputedRef<T>;
  const id = `form-field-${nameRef.value}`;

  return {
    id,
    ...field,
    value,
  };
}

export function useForm<T>(options: UseFormOptions<Partial<T>> & { schema?: any }) {
  /**
   * Wrapper for @vorms/core useForm that handles validation with yup
   */

  return useVForm({
    ...options,
    validate: yupResolver(options.schema),
  });
}
