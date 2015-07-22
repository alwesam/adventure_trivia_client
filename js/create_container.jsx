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

    var jsonData = {adventure: {title: this.state.title,
                description: this.state.description,
                challenges: this.state.challenges,
                includeFinal: this.state.includeFinal}};
    console.log("And here is the data>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(jsonData);

    var url ="http://localhost:3000/adventures"; 
    
    $.ajax({
      type: "POST",
      url: url,
      data: jsonData,
      success: function (data) {
        console.log(data);
        this.setState({stage: 3});//list of adventures 
      }.bind(this)
    });
  },

  startAgain: function () {
    this.setState({stage: 0});
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
        return <div className="hompage-box"> 
                 <div className="homepage-actions">  
                  <div className="row"> 
                   <div className="col-md-4 col-md-offset-4">
                     <CreateOverview pass={this.receiveOverview} />
                   </div>
                  </div>
                 </div>
              </div>;
        break;
      case 1:
        return <div className="hompage-box"> 
                 <div className="homepage-actions">  
                  <div className="row"> 
                   <div className="col-md-4 col-md-offset-4">
                     <CreateChallenges locs={this.state.locations} pass={this.receiveChallenges} />
                   </div>
                  </div>
                 </div>
              </div>;
        //pass param to challenges --> list of locations
        //return <CreateChallenges locs={this.state.locations} pass={this.receiveChallenges} />; //call challenges container 
        break;
      case 2: 
        return <div>{includeGame} {submitButton}</div>;
        break;
      case 3: 
        return <div><Adventures /></div>;
        break;
    }

  }
});
