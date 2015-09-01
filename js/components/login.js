import React from 'react';  
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
import {login} from '../actions/actions.js';
import { connect } from 'react-redux';
import App from '../app.js';

var Login = React.createClass({

  getInitialState: function () {
    return {error: false};
  },

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
        this.setState({error: !data.success});
        if(data.success){
          dispatch(login());
          this.forceUpdate(); //not recommended but use for now
        } 
      }.bind(this)
    });
  
  },
  
  render: function() {
    //TODO fix
    var padding = {padding: 10};
    var error_message = "";
    if(this.state.error)
      error_message = <h5>Login infomration is incorrect</h5>;

    if(this.props.store.getState())
      return <div className="container">
                <h4><Link to="create" store={this.props.store}>Create an Adventure</Link></h4>
             </div>;
    else
      return (
        <div className="container">
          <div className="row col-lg-4">
            <h4 style={padding}>Please enter your login information</h4><br/>
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
            <div>
              {error_message}
            </div>
          </div>   
        </div>   
        ); 
  
  }
});

export default connect()(Login);
