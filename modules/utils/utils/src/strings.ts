function lowercaseFirstLetter(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}
export function toCamelCase(str: string): string {
  return str
    // First, handle the start of the string separately if it's uppercase
    .replace(/^([A-Z])/, (firstChar) => firstChar.toLowerCase())
    // Then, transform the rest of the string
    .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
}

export function escapeForSql(str: string): string {
  // Replace single quotes with two single quotes for SQL escaping
  return str.replace(/'/g, "''");
}
