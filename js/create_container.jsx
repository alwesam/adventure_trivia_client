//////////////////////////////
var CreateAdventure = React.createClass({

  getInitialState: function () {
    return {
              stage: 0, //0 for overview, 1 for challenges, 2 for include_final & submit button
              title: "", //get from overview
              success: false, //check if post request is successful
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

    var jsonData = {adventure: {title: this.state.title,
                description: this.state.description,
                challenges: this.state.challenges,
                include_final: this.state.includeFinal}};

    console.log(jsonData);
    var url ="http://localhost:3000/adventures"; 
    
    $.ajax({
      type: "POST",
      url: url,
      data: jsonData,
      success: function (data) {
        console.log(data.success);
        this.setState({success: data.success});
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

    var style1 = {width: "70%", float: "left"};
    var style2 = {width: "30%", float: "left", height: "20px" };
    var includeGame = <div className="form-group">
                           <label style={style1}><h3>Include Final Challenge? </h3></label>
                           <input style={style2} className="form-control" type="checkbox" ref="checkGame" onChange={this.checkGame}/>
                      </div>;  

    var submitButton = <div className="form-group">
                        <input className="form-control" type="submit" value="Create Adventure" onClick={this.onSubmit} disabled={!this.isReady()} />
                       </div>;

    switch (this.state.stage) {
      case 0:
        return <div className="create-page"> 
                  <div className="row"> 
                   <div className="col-md-4 col-md-offset-4">
                     <CreateOverview pass={this.receiveOverview} />
                   </div>
                 </div>
              </div>;
        break;
      case 1:
        return <div className="create-page"> 
                  <div className="row"> 
                   <div className="col-md-4 col-md-offset-4">
                     <CreateChallenges locs={this.state.locations} pass={this.receiveChallenges} />
                   </div>
                 </div>
              </div>;
        //pass param to challenges --> list of locations
        //return <CreateChallenges locs={this.state.locations} pass={this.receiveChallenges} />; //call challenges container 
        break;
      case 2: 
        return <div className="create-page">
                  <div className="row"> 
                   <div className="col-md-4 col-md-offset-4">
                    {includeGame} {submitButton}
                   </div>
                </div>
              </div>;
        break;
      case 3: 
        var move = this.state.success ? <Adventures /> : <CreateAdventure />; //redo if fail
        return move;
        break;
    }

  }
});
