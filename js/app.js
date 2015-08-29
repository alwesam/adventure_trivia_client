import React from 'react';  
import Router from 'react-router';  
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
//import redux stuff
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import loginUser from './reducers/reducers.js';

import Home             from  './components/home.js';
import Login            from  './components/login.js';
import CreateAdventure  from  './components/create_container.js';
import CreateOverview   from  './components/create_title_desc_loc.js';
import CreateChallenges from  './components/create_challenge_container.js';
import CreateFinalComp  from  './components/create_finalcomp.js';
import Adventures       from  './components/play.js';
import PlayAdventure    from  './components/playadventure.js';
import FinalPage        from  './components/final.js';

var store = createStore(loginUser);

var App = React.createClass({
  logout: function () {
    console.log("clicked logout");
    store.dispatch({type: 'LOGOUT'});
  },
  render: function () {
    //this.props.store passed from app
     var loglink = "";
     if(!store.getState())
       loglink = <Link to="/login">Login</Link>;
     else
       loglink = <a onClick={this.logout}>Logout</a>;
     return  <div>
              <Link to="/">Home</Link> |&nbsp;
              {loglink} 
              <RouteHandler store={store} />
            </div>;
  }
});

//TODO the code below looks problematic
var routes = (
  <Route handler={App}>
    <DefaultRoute handler={Home} />
    <Route name="login"  path="/login"  handler={Login} />}
    <Route   name="create"            path="/create"            handler={CreateAdventure} >
      <Route name="create_overview"   path="/create/overview"   handler={CreateOverview}/>
      <Route name="create_challenges" path="/create/challenges" handler={CreateChallenges}/>
      <Route name="create_final"      path="/create/final"      handler={CreateFinalComp}/>
    </Route>
    <Route name="play"          path="/play"           handler={Adventures} />
    <Route name="playadventure" path="/play/:id"       handler={PlayAdventure} />
    <Route name="finalpage"     path="/play/:id/final" handler={FinalPage} />
  </Route>
);

Router.run(routes, function(Handler) {
  React.render(
    <Provider store={store}>
      {() => <Handler/> } 
    </Provider>,
    document.body);
});
