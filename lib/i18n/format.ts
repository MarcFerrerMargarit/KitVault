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
