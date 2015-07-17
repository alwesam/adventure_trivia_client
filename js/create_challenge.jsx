var CreateChallenge = React.createClass({
  getInitialState: function () {
    return {riddle: false, //view 0 for questions, 1 for riddle, 2 submit
            questions: [],
            riddle   : {}
           }; 
  },

  addQuestion: function (question_obj) {
    var arr = this.state.questions;
    arr.push(question_obj); 
    this.setState({questions: arr});
  },

  completeQuestions: function () {
    this.setState({riddle: true});
  },

  onSubmit: function () {
    //test point
    //var obj = {address: this.props.loc, questions: "This is a question", riddle: "this is a riddle"}; 
    var obj = {address: this.props.loc, questions: this.state.questions, riddle: this.state.riddle}; 
    this.props.addToChallenges(obj);
  },

  receiveRiddle: function (riddle_obj) {
    //{content: "", hint: "", solution ""}
    this.setState({riddle: riddle_obj}); 
    this.onSubmit();
  },

  render: function () {
    //test
    //here render the questions and riddle
    ///if(this.state.riddle)
    if(true) //testing
      return <div> <CreateRiddle nextLoc={this.props.nextLoc} pass={this.receiveRiddle} />  </div>;
    else
      return <CreateQuestion loc={this.props.loc}/>;

    //return <div>This is is a challenge on {this.props.loc} {submitButton}</div>
    
  }

});
