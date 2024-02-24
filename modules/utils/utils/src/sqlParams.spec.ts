import { escapeSqlParameters } from "./strings";

describe('escapeSqlParameters', () => {
  const lookupMap = {
    'projectId': {escape: true},
    'env.name': {escape: true},
    'userId':  {escape: false},
  };

  test('escapes parameters that require it', () => {
    const sql = "SELECT * FROM users WHERE userId = :userId AND projectId = :projectId";
    const expected = "SELECT * FROM users WHERE userId = :userId AND projectId = ':projectId'";
    expect(escapeSqlParameters(sql, lookupMap)).toBe(expected);
  });

  test('handles parameters with dots and escapes as required', () => {
    const sql = "SELECT * FROM config WHERE key = :env.name";
    const expected = "SELECT * FROM config WHERE key = ':env.name'";
    expect(escapeSqlParameters(sql, lookupMap)).toBe(expected);
  });

  test('leaves parameters without escape requirement unchanged', () => {
    const sql = "DELETE FROM sessions WHERE userId = :userId";
    const expected = "DELETE FROM sessions WHERE userId = :userId";
    expect(escapeSqlParameters(sql, lookupMap)).toBe(expected);
  });

  test('correctly processes mixed parameters', () => {
    const sql = "UPDATE projects SET name = :name WHERE projectId = :projectId AND userId = :userId";
    const expected = "UPDATE projects SET name = :name WHERE projectId = ':projectId' AND userId = :userId";
    expect(escapeSqlParameters(sql, lookupMap)).toBe(expected);
  });
});
