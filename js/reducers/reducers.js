import { LOGIN, LOGOUT } from '../actions/actions.js';

function loginUser(state=0, action) {
  switch (action.type) {
    case LOGIN:
      return true;
    case LOGOUT:
      return false;
    default:
      return false;
  }
}

export default loginUser;
