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
    if (prevProps.loc != this.props.loc)
      this.setState({questions: []}); //flush
    if(prevState.stage != this.state.stage && this.state.stage == 2)
      this.onSubmit();
  },

  //TODO heavey development
  addQuestions: function(question_arr) {
    this.setState({questions: question_arr});
    this.setState({stage: 1});
  },

  onSubmit: function () {
    //test point
    //var obj = {address: this.props.loc, questions: "This is a question", riddle: "this is a riddle"}; 
    var obj = {address: this.props.loc, questions: this.state.questions, riddle: this.state.riddle}; 
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

    var submitButton = <div><input type="submit" value="Next Stage" onClick={this.onSubmit} disabled={!this.isReady()} /></div>;

    if(this.state.stage == 0) //first answer question(s)
      return <CreateQuestionsContainer addToChallenge={this.addQuestions} loc={this.props.loc} />;
    else if(this.state.stage == 1) //then answer riddle
      return <div> <CreateRiddle nextLoc={this.props.nextLoc} pass={this.receiveRiddle} />  </div>;
    else return <div>Hello</div>; //tester
    
  }

});
