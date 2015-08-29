import React from 'react';  
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
import {login} from '../actions/actions.js';
import { connect } from 'react-redux';
import App from '../app.js';

var Login = React.createClass({

  onSubmit: function (e) {

    //injected by connect
    const { dispatch } = this.props;

    e.preventDefault();
    var email    = this.refs.email.getDOMNode().value;
    var password = this.refs.password.getDOMNode().value;
    var jsonData = {email: email, password: password};
    var url = "http://stark-ridge-5017.herokuapp.com/login";

    $.ajax({
      type: "POST",
      url: url,
      data: jsonData,
      success: function (data) {
        //store login information
        if(data.success){
          console.log("authentication "+data.success);
          dispatch(login());
          this.forceUpdate(); //not recommended but use for now
        } 
      }.bind(this)
    });
  
  },
  
  render: function() {
    //TODO fix
    console.log("I'm rendering....");
    if(this.props.store.getState())
      return <h3><Link to="create">Create an Adventure</Link></h3>;
    else
      return (
        <div className="container">
        <div className="row col-lg-4">
          <form role="form" onSubmit={this.onSubmit}>
            <div className="form-group">
              <label name="email">Email</label>
              <input className="form-control" type="text" name="email" ref="email" />
            </div>
            <div className="form-group">
              <label name="password">Password</label>
              <input className="form-control" type="password" name="password" ref="password"/>
            </div>
            <button type="submit" className="btn btn-default">Login</button>
          </form>
        </div>   
        </div>   
        ); 
  
  }
});

export default connect()(Login);
