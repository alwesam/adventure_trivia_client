var CreateChallenges = React.createClass({

  getInitialState: function () {
    return {stage: 0, challenges: []}; //number of stages correspond to number of locations here 
  },

  addChallenge: function (challenge_obj) { //returns an object {address: "", questions: "", riddle: ""}

    if(this.state.stage < this.props.locs.length-1){
      //a bit iffy
      var arr = this.state.challenges;
      arr.push(challenge_obj);
      this.setState({challenges: arr});
      this.setState({stage: this.state.stage+1});
    } else {
      this.pass();
    }
    
  },

  pass: function () {
    //pass challenges array to parent create_container 
    this.props.pass(this.state.challenges);
  },

  render: function () {
    return <CreateChallenge loc={this.props.locs[this.state.stage]}
                            nextLoc = {this.props.locs[this.state.stage+1]} //check for null value
                             addToChallenges={this.addChallenge} />;
  }

});
