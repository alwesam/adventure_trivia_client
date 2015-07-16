//start the adventure, this will be a new page
var PlayAdventure = React.createClass({
  getInitialState: function() {
    return { current: 0, 
             showQuestions: false, 
             resetMap: false, 
             finalChallenge: false }
  },

  componentDidMount: function () {
  },

  proceedToNext: function() {
    if (this.state.current < this.props.challenges.length-1){
      this.setState({current: this.state.current + 1});
      //here get the next batch of questions
      //do a get request to get riddle


      this.setState({showQuestions: false});
      //reset map
      this.setState({resetMap: true});
    }
    else {
      this.setState({finalChallenge: true});
      this.setState({resetMap: true});
      this.setState({showQuestions: false});
    }
  },

  renderQuestions: function() {
    //TODO review this dirty hack
    this.setState({resetMap: false});
    this.setState({showQuestions: true}); 
  },
  
  render: function () {
    var challenge = this.props.challenges[this.state.current];
    //debugger
    var loc     = challenge.address;
    var lat     = challenge.latitude; 
    var lng     = challenge.longitude; 

    //differ later
    var qa      = [{content: "boo", correctAnswer:"boo", answers: ["boo","boo","boo"]},
                   {content: "boo", correctAnswer:"boo", answers: ["boo","boo","boo"]},
                   {content: "boo", correctAnswer:"boo", answers: ["boo","boo","boo"]}];
    var clue    = "Just make you happy";
    var clueHint= "Just make you happy";
    var clueAns = "Just make you happy"; 
    
    //TODO improve logic once data is retrieved from server
    var quiz = [{qtext: qa[0].content,
                 ctext: qa[0].correctAnswer,
                 atext: [qa[0].answers[0], qa[0].answers[1], qa[0].answers[2]]},
                {qtext: qa[1].content,
                 ctext: qa[1].correctAnswer,
                 atext: [qa[1].answers[0], qa[1].answers[1], qa[1].answers[2]]},
                {qtext: qa[2].content,
                 ctext: qa[2].correctAnswer,
                 atext: [qa[2].answers[0], qa[2].answers[1], qa[2].answers[2]]}];
    
    var quizForm = <Quiz onComplete={this.proceedToNext} loc={loc}  quiz ={quiz} clue={clue} clueAns={clueAns}/>;
    var mapForm = <Map loc={loc} renderQuestions={this.renderQuestions} resetMap={this.state.resetMap} />;

    var monsterForm = <Monster />;
    var quizDescForm = <QuizDesc />;

    //here a giant if-else statement with showQuestions
    if (this.state.showQuestions) 
      return <div><h1>{this.props.name}</h1>
              <div className="row">
                <div className="col-md-3">{quizForm}</div>
                <div className="col-md-9">{mapForm}</div>
              </div>
            </div>;
    else if (this.state.finalChallenge && this.props.include_final)
      return <div><Monster /></div>;
    else 
      return <div><h1>{this.props.name}</h1>
              <div className="row">
                <div className="col-md-3">{quizDescForm}</div>
                <div className="col-md-9">{mapForm}</div>
              </div>
            </div>;
  } 
});
