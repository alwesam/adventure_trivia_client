var CreateOverview = React.createClass({
  getInitialState: function () {
    return {
              adventureTitle: "",
              adventureDescription: "",
              autocomplete: "",
              adventureLocations: []
            };
  },

  componentDidMount: function () {

    //$('.locsBox').select2({
    //  placeholder: "select a place"
    //});

    //TODO find a solution
    //this.setState({ autocomplete: new google.maps.places.Autocomplete(
    //  /** @type {HTMLInputElement} */(this.refs.locInput.getDOMNode()),
    //  { types: ['geocode'] }) }); 

  },

  nameInput: function () {
    this.setState({adventureTitle: this.refs.nameInput.getDOMNode().value}); 
  },

  locInput: function () {

    //TODO fix
    //jquery chosen way??
    //var locString = this.refs.locInput.getDOMNode().value; 
    //var locString = this.refs.locInput.getDOMNode().chosen(); 

    var locString = this.refs.locInput.getDOMNode().value; 
    
    this.setState({adventureLocations: locString.trim().split(";") }); 
    //this.setState({adventureLocations: locString }); 

  },

  descInput: function () {
    this.setState({adventureDescription: this.refs.descInput.getDOMNode().value}); 
    //console.log(this.state.adventureDescription);
  },

  isReady: function () {
    return (this.state.adventureTitle.length > 0 &&
            this.state.adventureDescription.length >0 &&
            this.state.adventureLocations.length > 0); 
  },

  onSubmit: function () {
    this.props.pass(this.state.adventureTitle,
                    this.state.adventureDescription,
                    this.state.adventureLocations);
    console.log("passed locations: "+this.state.adventureLocations);
  },

  render: function () {

    var name = <div className="form-group">
                <input type="text" placeholder="Enter Name of Adventure" ref="nameInput" onChange={this.nameInput} className="form-control"/>
               </div>;  
    var description = <div className="form-group">
                        <textarea name="description" placeholder="Enter a description" ref="descInput" onChange={this.descInput} className="form-control" />
                      </div>;  
    var locsBox = <div className="form-group">
                    <textarea className="locsBox" name="locations" 
                              placeholder="Enter Locations separated by semicolon" 
                              ref="locInput" onChange={this.locInput} className="form-control"/>
                  </div>;  

    //TODO style as next button
    var nextButton = <div className="form-group">
                         <input type="submit" className="form-control" value="Next" onClick={this.onSubmit} disabled={!this.isReady()} />
                       </div>;
    //giant if-else statement here to render different views depending on state
    return <div className="form">{name} {description} {locsBox} {nextButton}</div>;
  
  }

});
