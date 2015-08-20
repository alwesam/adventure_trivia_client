//Note this will be part of the index page
import React from 'react';  
import Router from 'react-router';  
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';

var Adventure = React.createClass({

  getInitialState: function () {
    return {description: "",
            detailsFetched: false}
  },

  fetchDetails: function () {
      this.setState({
        detailsFetched: true
      }); 
  },

  hideDetails: function () {
    this.setState({detailsFetched: false});
  },

  render: function () {

    var arr=[];
    for (var i = 0; i< parseInt(this.props.rating); i++)
      arr.push('');

    if(this.props.rating > 0)
      var stars = arr.map(function (i) {
              return <img src="img/ruby.png" height="30" width="30" /> });
    else
      var stars = <h5>Not Rated Yet</h5>

    if (this.state.detailsFetched) {
      return <div className="row adventure-item-details">
                <div className="col-md-6">
                  <h3>{this.props.name}</h3>
                  <div>{stars}</div>
                </div>
                <div className="col-md-5">
                  <h4>{this.props.description}</h4>
                  <button className="btn btn-danger"><Link to="playadventure" params={{id: this.props.id}}
                      query={{token: this.props.token, name: this.props.name}}>Play</Link></button>
                </div>
                <div className="col-md-1">
                  <button className="btn btn-link" href="#" onClick={this.hideDetails} >X</button>
                </div>
              </div>;
    }
    else {
      var style = {float: "left"};
      return <div className="adventure-item">
               <h3><a href="#/play" onClick={this.fetchDetails}> {this.props.name}</a></h3>
             </div>;
    }
  }

});

var Adventures = React.createClass({
  getInitialState: function () {
    return {adventures: [], 
            showSpinner: true}
  },

  componentDidMount: function () {
    
    var url = "http://localhost:3000/adventures";
    $.ajax({
      type: "GET",
      url: url,
      success: function (data) {
        this.setState({adventures: data});
        this.setState({showSpinner: false});
      }.bind(this)
    });
  },

  render: function () {
    
    var adventures = this.state.adventures.map(function(a) {
          return <Adventure name={a.title} 
                            id={a.id} 
                            token={a.token} 
                            description={a.description} 
                            rating={a.average_rating} 
                             />; 
    }.bind(this));

    var spinnerDisplay = this.state.showSpinner ? "block" : "none";
    var spinnerStyle   = {display: spinnerDisplay};
    
    return <div className="create-page">
             <div style={spinnerStyle} className="text-center">
               <h2>Loading...</h2>
             </div>
             <div className="adventures-list">
              {adventures}
             </div>
           </div>;
  }

});

export default Adventures;
