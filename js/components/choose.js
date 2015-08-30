import React from 'react';  
import Router from 'react-router';  
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';

var Monster = React.createClass({

  getInitialState: function () {
    return {choose: false};
  },

  choose: function () {
    this.setState({choose: true});
  },

  render: function(){
    var monster = <div className="text-center final-page">
                    <h2>You have braved many risks to get here and for this I salute you</h2>
                    <img src="img/knight.png"/>
                    <h2>However, before you get your hands on the treasure, you must pass the final challenge </h2>
                    <h2>You must choose, but choose wisely</h2>
                    <div className="accept-box">
                      <button className="btn btn-danger" onClick={this.choose}>Accept Challenge</button>
                    </div>
                  </div>;

    var android   = <Link to="finalpage" params={{id: this.props.id}} query={{won: "true"}} ><img width="200" border="5" src="img/android.png" /></Link>;
    var iphone    = <Link to="finalpage" params={{id: this.props.id}} query={{won: "false"}}><img width="200" border="5" src="img/iphone.png"  /></Link>;
    
    if (this.state.choose)
      return <div className="text-center final-page">
              <h1> Choose Wisely </h1>
              <div className="finalpage-box">
                  <div className="col-md-6">
                    {android}
                  </div>
                  <div className="col-md-6">
                   {iphone}
                  </div>
               </div>
              </div>;
    else
      return monster;
  }

});

export default Monster;
