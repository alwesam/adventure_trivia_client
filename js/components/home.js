import React from 'react';  
import Router from 'react-router';  
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';

var Home = React.createClass({
  render: function () {
    var homePage = <div className="text-center homepage-box">
                       <h1>Welcome to Adventure Trivia</h1>
                       <img src="img/background.jpg" />
                       <h3><Link to="play">Play an Adventure</Link></h3>
                       <h3><Link to="create">Create an Adventure</Link></h3>
                   </div>;
     return  homePage;
  }
});

export default Home;
