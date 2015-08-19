var CreateChallenges = React.createClass({

  getInitialState: function () {
    return {stage: 0, challenges: [], didPass: false}; //number of stages correspond to number of locations here 
  },

  componentDidUpdate: function (prevState, nexState) {
   if (this.state.stage != prevState.stage && !this.state.didPass && 
       this.state.stage === this.props.locs.length)
        this.pass(); 
  },

  addChallenge: function (challenge_obj) { //returns an object {address: "", questions: "", riddle: ""}

      console.log("adding to challenge*** "+this.state.stage);
      var arr = this.state.challenges;
      arr.push(challenge_obj);
      this.setState({challenges: arr});
      this.setState({stage: this.state.stage+1});
    
  },

  pass: function () {
    //pass challenges array to parent create_container 
    this.props.pass_challenges(this.state.challenges);
    //to prevent overflowing
    this.setState({didPass: true});
  },

  render: function () {
    return <CreateChallenge loc={this.props.locs[this.state.stage]}
                            nextLoc = {this.props.locs[this.state.stage+1]} //TODO debug check for null value
                             addToChallenges={this.addChallenge} />;
  }

});
