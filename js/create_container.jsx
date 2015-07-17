//////////////////////////////
var CreateAdventure = React.createClass({

  getInitialState: function () {
    return {
              stage: 0, //0 for overview, 1 for challenges, 2 for include_final & submit button
              title: "", //get from overview
              description: "", //get from overview
              locations: [], //get from overview
              challenges: [], //receive challenges as an array
              includeFinal: false, //from this container
              jsonData: {} //might not need it
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

  checkGame: function () {
    this.setState({includeFinal: this.refs.checkGame.getDOMNode().checked});
  },

  onSubmit: function () {
    console.log(this.state.challenges);
    console.log(this.state.title);
    console.log(this.state.description);
    console.log(this.state.includeFinal);
    var jsonData = {title: this.state.title,
                description: this.state.description,
                challenges: this.state.challenges,
                includeFinal: this.state.includeFinal};
    console.log("And here is the data>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(jsonData);
    //construct a json and do an
    //ajax post request to server 
    //and then render home page
  },

  isReady: function () {
    return true;
  },

  render: function () {

    var includeGame = <div><input type="checkbox" ref="checkGame" onChange={this.checkGame}/>
                           <strong>Include Final Challenge? </strong></div>;  
    var submitButton = <input type="submit" value="Create Adventure" onClick={this.onSubmit} disabled={!this.isReady()} />;

    switch (this.state.stage) {
      case 0:
        return <CreateOverview pass={this.receiveOverview} />;
        break;
      case 1:
        //pass param to challenges --> list of locations
        return <CreateChallenges locs={this.state.locations} pass={this.receiveChallenges} />; //call challenges container 
        break;
      case 2: 
        return <div>{includeGame} {submitButton}</div>
        break;
    }

  }
});
