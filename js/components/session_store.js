import {createStore} from 'redux';

var loginstate = function (action) {

  switch(action.type) {
    case 'LOGIN':
      return true;
    case 'LOGOUT':
      return false;
    default :
      return false;
  }

}

var store = createStore(loginstate);

//store.dispatch({type: 'LOGIN'});
//store.dispatch({type: 'LOGOUT'});
