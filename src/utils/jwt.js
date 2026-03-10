import { jwtDecode } from 'jwt-decode';

/**
 * Returns true if the token is missing, malformed, or past its expiry time.
 * @param {string | null} token
 * @returns {boolean}
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    return exp < Date.now() / 1000;
  } catch {
    return true;
  }
};
