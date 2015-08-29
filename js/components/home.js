import React from 'react';  
import Router from 'react-router';  
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
import { connect } from 'react-redux';

var Home = React.createClass({
  render: function () {
    var create = "";
    if(this.props.store.getState())
      create = <h3><Link to="create">Create an Adventure</Link></h3>
    else
      create = <h3><Link to="login">Login</Link> to create your own adventure</h3>;

    var homePage = <div className="text-center homepage-box">
                       <h1>Welcome to Adventure Trivia</h1>
                       <img src="img/background.jpg" />
                       <h3><Link to="play">Play an Adventure</Link></h3>
                       {create} 
                   </div>;
     return  homePage;
  }
});

export default connect()(Home);
