import React from 'react';  
import Router from 'react-router';  
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';

import Home from './components/home.js';
import CreateAdventure from './components/create_container.js';
//import CreateOverview from './components/create_title_desc_loc.jsx';
//import CreateChallenges from './components/create_challenge_container.jsx';
//import CreateFinalComp from './components/create_finalcomp.jsx';
import Adventures from './components/play.js';
import PlayAdventure from './components/playadventure.js';
import FinalPage from './components/final.js';

var App = React.createClass({
  render: function () {
     return  <div>
              <Link to="/">Home</Link>
              <RouteHandler/>
            </div>;
  }
});

//TODO test
var routes = (
  <Route handler={App}>
    <DefaultRoute handler={Home} />
    <Route name="create" path="/create" handler={CreateAdventure} >
    </Route>
    <Route name="play" path="/play"                    handler={Adventures} />
    <Route name="playadventure" path="/play/:id"       handler={PlayAdventure} />
    <Route name="finalpage"     path="/play/:id/final" handler={FinalPage} />
  </Route>
);

/*var routes = (  
  <Route handler={App}>
    <DefaultRoute handler={Home} />
    <Route name="create" path="/create" handler={CreateAdventure}>
      <Route name="create_overview" path="/create/overview" handler={CreateOverview}/>
      <Route name="create_challenges" path="/create/challenges" handler={CreateChallenges}/>
      <Route name="create_final" path="/create/final" handler={CreateFinalComp}/>
    </Route>
    <Route name="play" path="/play" handler={Adventures} />
    <Route name="playadventure" path="/play/:id"       handler={PlayAdventure} />
    <Route name="finalpage"     path="/play/:id/final" handler={FinalPage} />
  </Route>
);*/

Router.run(routes, function(Handler) {
  //React.render(<Handler />, document.getElementById("adventure"));
  React.render(<Handler/>, document.body);
});

