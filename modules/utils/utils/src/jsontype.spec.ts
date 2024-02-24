import { transformKeys } from "./jsontype";

const appendTtoKey = (key: string) => key + '_t';

describe('transformKeys with s => s + "_t"', () => {
  test('transforms keys of a simple object', () => {
    const input = { key1: 'value1', key2: 'value2' };
    const expected = { key1_t: 'value1', key2_t: 'value2' };
    expect(transformKeys(appendTtoKey)(input)).toEqual(expected);
  });

  test('transforms keys in a nested object', () => {
    const input = { level1: { key1: 'value1', key2: 'value2' } };
    const expected = { level1_t: { key1_t: 'value1', key2_t: 'value2' } };
    expect(transformKeys(appendTtoKey)(input)).toEqual(expected);
  });

  test('transforms keys in an array of objects', () => {
    const input = [{ key1: 'value1' }, { key2: 'value2' }];
    const expected = [{ key1_t: 'value1' }, { key2_t: 'value2' }];
    expect(transformKeys(appendTtoKey)(input)).toEqual(expected);
  });

  test('transforms keys in a complex nested structure', () => {
    const input = {
      level1: {
        key1: { level2: 'value1' },
        key2: [{ level2: 'value2' }, { level3: 'value3' }]
      }
    };
    const expected = {
      level1_t: {
        key1_t: { level2_t: 'value1' },
        key2_t: [{ level2_t: 'value2' }, { level3_t: 'value3' }]
      }
    };
    expect(transformKeys(appendTtoKey)(input)).toEqual(expected);
  });

  test('leaves primitives untouched', () => {
    const input = 'testString';
    const expected = 'testString';
    expect(transformKeys(appendTtoKey)(input)).toEqual(expected);
  });
});
