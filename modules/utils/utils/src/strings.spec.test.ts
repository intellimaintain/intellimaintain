import { splitAndCapitalize, toCamelCase } from "./strings";

describe('toCamelCase', () => {
  test('converts mixed separators while preserving existing camelCase', () => {
    const input = "Example-string_with mixedSeparation";
    const output = "exampleStringWithMixedSeparation";
    expect(toCamelCase(input)).toBe(output);
  });

  test('converts string starting with uppercase', () => {
    const input = "ThisStartsWithUppercase and_has_mixed-separation";
    const output = "thisStartsWithUppercaseAndHasMixedSeparation";
    expect(toCamelCase(input)).toBe(output);
  });

  test('preserves existing camelCase within the string', () => {
    const input = "alreadyInCamelCase ANDThisIsMixed";
    const output = "alreadyInCamelCaseANDThisIsMixed";
    expect(toCamelCase(input)).toBe(output);
  });

  test('converts all lowercase with separators to camelCase', () => {
    const input = "all-lowercase with_separators";
    const output = "allLowercaseWithSeparators";
    expect(toCamelCase(input)).toBe(output);
  });

  test('handles numbers and special characters within the string', () => {
    const input = "some_numbers123 and_special$chars";
    const output = "someNumbers123AndSpecialChars";
    expect(toCamelCase(input)).toBe(output);
  });
});

// Import the function if it's defined in a separate module, for example:
// import { splitAndCapitalize } from './path-to-your-function';

describe('splitAndCapitalize', () => {
  it('converts camelCase to space-separated words with the first letter capitalized', () => {
    expect(splitAndCapitalize('helloWorld')).toBe('Hello World');
    expect(splitAndCapitalize('ThisIsASample')).toBe('This Is A Sample');
  });

  it('handles single-word input without spaces', () => {
    expect(splitAndCapitalize('Word')).toBe('Word');
  });

  it('returns an empty string for empty input', () => {
    expect(splitAndCapitalize('')).toBe('');
  });

  it('returns an empty string for undefined input', () => {
    expect(splitAndCapitalize(undefined)).toBe('');
  });

});
