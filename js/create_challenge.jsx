var CreateChallenge = React.createClass({
  getInitialState: function () {
    return {stage: 0, questions: [],
            riddle   : {}
           }; 
  },

  componentWillReceiveProps: function (nextProps) {
    console.log("updating prop loc "+this.props.loc);
    if (nextProps.loc != this.props.loc)
      this.setState({stage: 0}); 
  },

  componentDidUpdate: function (prevProps, prevState) {
  },

  addQuestion: function (question_obj) {
    var arr = this.state.questions;
    arr.push(question_obj); 
    this.setState({questions: arr});
    this.setState({stage: 1});
  },

  completeQuestions: function () {
    console.log("question completed>>>>>>>>>");
    this.setState({stage: 1});
  },

  onSubmit: function () {
    //test point
    //var obj = {address: this.props.loc, questions: "This is a question", riddle: "this is a riddle"}; 
    var obj = {address: this.props.loc, questions: this.state.questions, riddle: this.state.riddle}; 
    this.setState({proceed: false}); //loop back
    this.props.addToChallenges(obj);
  },

  isReady: function () {
     return Object.keys(this.state.riddle).length > 0
  },

  receiveRiddle: function (riddle_obj) {
    //{content: "", hint: "", solution ""}
    this.setState({riddle: riddle_obj, stage: 2}); 
  },

  render: function () {

    console.log("my state now is "+this.state.stage);
    var submitButton = <div><input type="submit" value="Next Question" onClick={this.onSubmit} disabled={!this.isReady()} /></div>;

    //var submitQuestion = <div><input type="submit" value="Submit Question" onClick={this.completeQuestions} /></div>;

    if(this.state.stage == 0) //first answer question(s)
      //return <div> Here is my question about {this.props.loc} {submitQuestion} </div>; //replace with question form 
      return <div> <div> Here is my question about {this.props.loc}</div> <CreateQuestion addToQuestions={this.addQuestion} /> </div>;
    else if(this.state.stage == 1) //then answer riddle
      return <div> <CreateRiddle nextLoc={this.props.nextLoc} pass={this.receiveRiddle} />  </div>;
    else if(this.state.stage == 2 && this.props.nextLoc != null) //then go to nextstage
      return <div> Now Get ready to add questions on {this.props.nextLoc} {submitButton}</div>;
    else
      return <div> Now You are done {submitButton}</div>;
      
    
  }

});
