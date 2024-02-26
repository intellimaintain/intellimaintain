export function extractPathFromDescription(input: string): string {
  // Regular expression to match the pattern .focus?(...) and capture the inner content
  const regex = /\.focus\?\(([^)]+)\)/g;
  let match;
  const parts = [];

  // Use a loop to find all matches and push the captured groups into the parts array
  while ((match = regex.exec(input)) !== null) {
    parts.push(match[1]);
  }

  // Join the captured parts with a dot and return the result
  return parts.join('.');
}

export function dropFirstSegments(input: string, n: number): string {
  // Split the input string into segments based on the dot
  const segments = input.split('.');

  // Drop the first n segments and join the remaining segments with a dot
  const result = segments.slice(n).join('.');

  return result;
}