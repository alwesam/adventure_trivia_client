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

    var name = <div><input type="text" placeholder="Enter Name of Adventure" ref="nameInput" onChange={this.nameInput}/></div>;  
    var description = <div><textarea name="description" placeholder="Enter a description" ref="descInput" onChange={this.descInput} /></div>;  
    var locsBox = <div><textarea className="locsBox" name="locations" placeholder="Enter Locations separated by semicolon" ref="locInput" onChange={this.locInput}/></div>;  
    //this is a test
    //var locsBox = <select multiple="true" name="locations" ref="locInput" onChange={this.locInput}>
    //                <option value="AC">Apple</option>
    //                <option value="AD">Banana</option>
    //                <option value="AM">Citrus</option>
    //                <option value="AP">Dragonfruit</option>
    //              </select>;
    //TODO style as next button
    var nextButton = <div><input type="submit" value="Next" onClick={this.onSubmit} disabled={!this.isReady()} /></div>;
    //giant if-else statement here to render different views depending on state
    return <div>{name} {description} {locsBox} {nextButton}</div>
  
  }

});
