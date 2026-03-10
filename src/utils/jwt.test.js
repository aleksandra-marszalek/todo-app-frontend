import { describe, it, expect } from 'vitest';
import { isTokenExpired } from './jwt';

// Generates a minimal JWT with a given exp claim (no signature validation needed for jwtDecode)
const makeToken = (exp) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ exp }));
  return `${header}.${payload}.sig`;
};

describe('isTokenExpired', () => {
  it('returns true for null', () => {
    expect(isTokenExpired(null)).toBe(true);
  });

  it('returns true for undefined', () => {
    expect(isTokenExpired(undefined)).toBe(true);
  });

  it('returns true for an empty string', () => {
    expect(isTokenExpired('')).toBe(true);
  });

  it('returns true for a malformed token', () => {
    expect(isTokenExpired('not.a.token')).toBe(true);
  });

  it('returns true when the token is expired', () => {
    const pastExp = Math.floor(Date.now() / 1000) - 60;
    expect(isTokenExpired(makeToken(pastExp))).toBe(true);
  });

  it('returns false when the token is valid', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    expect(isTokenExpired(makeToken(futureExp))).toBe(false);
  });

  it('returns true when the token expires exactly now (boundary)', () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    // exp === now means it has already expired
    expect(isTokenExpired(makeToken(nowSeconds - 1))).toBe(true);
  });
});
