import { combineReducers } from 'redux'
import { LOGIN, LOGOUT, ADD_TOKEN } from '../actions/actions.js';

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

function addToken(state=0, action) {
  switch (action.type) {
    //TODO check
    case ADD_TOKEN:
      return action.text;
    default:
      return "";
  }
}

var accessUser = combineReducers({
  loginUser,
  addToken
});

//export default accessUser;
export default loginUser;
