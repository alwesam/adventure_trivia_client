import React from 'react';  
import Router from 'react-router';  
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';

var CreateOverview = React.createClass({
  getInitialState: function () {
    return {
              adventureTitle: "",
              adventureDescription: "",
              autocomplete: "",
              adventureLocations: []
            };
  },

  nameInput: function () {
    this.setState({adventureTitle: this.refs.nameInput.getDOMNode().value}); 
  },

  locInput: function () {
    var locString = this.refs.locInput.getDOMNode().value; 
    this.setState({adventureLocations: locString.trim().split(";") }); 
  },

  descInput: function () {
    this.setState({adventureDescription: this.refs.descInput.getDOMNode().value}); 
  },

  isReady: function () {
    return (this.state.adventureTitle.length > 0 &&
            this.state.adventureDescription.length > 0 &&
            this.state.adventureLocations.length > 0); 
  },

  onSubmit: function () {
    this.props.pass(this.state.adventureTitle,
                    this.state.adventureDescription,
                    this.state.adventureLocations);
  },

  render: function () {

    var name = <div className="form-group">
                <input type="text" placeholder="Enter Name of Adventure" ref="nameInput" onChange={this.nameInput} className="form-control"/>
               </div>;  
    var description = <div className="form-group">
                        <textarea name="description" placeholder="Enter a description" ref="descInput" onChange={this.descInput} className="form-control" />
                      </div>;  
    var locsBox = <div className="form-group">
                    <textarea name="locations" 
                              placeholder="Enter Locations separated by semicolon" 
                              ref="locInput" onChange={this.locInput} className="form-control"/>
                  </div>;  

    
    
    //TODO style as next button
    var saveButton = <div className="form-group">
                         <input type="submit" className="form-control" value="Save" onClick={this.onSubmit} disabled={!this.isReady()} />
                     </div>;

    var nextButton = <div className="form-group">
                       <Link to="create_challenges"><input type="submit" className="form-control" value="Next" disabled={!this.isReady()} /></Link>
                     </div>;

    return <div className="form">{name} {description} {locsBox} {saveButton} {nextButton}</div>;

  }

});

export default CreateOverview;
