/*
 * action types
 */
export const LOGIN  = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const ADD_TOKEN = 'ADD_TOKEN';

/*
 * action creators
 */
export function login() {
  return { type: LOGIN };
}

export function logout() {
  return { type: LOGOUT };
}

export function add_token(text) {
  return {type: ADD_TOKEN, text};
}
