/**
 * Fill `{name}` placeholders in a message.
 *
 * Deliberately tiny: the app only needs substitution, and a full ICU
 * implementation would be more machinery than the strings justify.
 */
export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/** A message with a singular and a plural form. */
export interface PluralMessage {
  one: string;
  other: string;
}

/**
 * Pick the right form and fill it in.
 *
 * English and Spanish share the same rule — one versus everything else — so a
 * full CLDR plural implementation would buy nothing here. A language with more
 * categories (Polish, Russian, Arabic) would need one.
 */
export function plural(
  message: PluralMessage,
  count: number,
  values: Record<string, string | number> = {},
): string {
  const form = count === 1 ? message.one : message.other;
  return fill(form, { count, ...values });
}
