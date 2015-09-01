import React from 'react';  
import Router from 'react-router';  
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
import { connect } from 'react-redux';
import Login from './login.js';

var CreateAdventure = React.createClass({

  getInitialState: function () {
    return {
              stage: 0, //0 for overview, 1 for challenges, 2 for include_final & submit button
              title: "", //get from overview
              success: false, //check if post request is successful
              description: "", //get from overview
              locations: [], //get from overview
              challenges: [], //receive challenges as an array
              includeFinal: false //from this container
            };
  },

  receiveOverview: function (title, desc, locs) {
    this.setState({stage: 1,
                   title: title,
                   description: desc,
                   locations: locs}); 
  },

  receiveChallenges: function (challenges) {
    this.setState({stage: 2,
                   challenges: challenges});
  },

  startAgain: function () {
    //this.setState({stage: 0});
    //link to begining again
  },

  render: function () {

        //TODO this is a temp quick fix
        if(!this.props.store.getState())
          //TODO not the best solution
          return <Login store={this.props.store} />;

        else
      
          return <div className="create-page"> 
                    <div className="row"> 
                     <div className="col-md-4 col-md-offset-4">
                       <Link to="create_overview" > Overview </Link> |
                       <Link to="create_challenges" >Challenges</Link> |
                       <Link to="create_final" >Final Step </Link> |
                       <RouteHandler pass={this.receiveOverview} 
                         locs={this.state.locations} 
                         pass_challenges ={this.receiveChallenges}
                         title={this.state.title}
                         description={this.state.description}
                         challenges={this.state.challenges}/>
                     </div>
                   </div>
                </div>;

  }
});

export default connect()(CreateAdventure);
