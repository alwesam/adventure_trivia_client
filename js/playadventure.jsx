//start the adventure, this will be a new page
var PlayAdventure = React.createClass({
  getInitialState: function() {
    return { current: 0, 
             challengeID: 0,
             showQuestions: false, 
             resetMap: false, 
             finalChallenge: false }
  },

  componentDidMount: function () {

  },

  proceedToNext: function() {
    if (this.state.current < this.props.challenges.length-1){

      //get questions from ajax and answers

      this.setState({current: this.state.current + 1});

      //reset map
      this.setState({showQuestions: false, resetMap: true});
    }
    else {
      this.setState({finalChallenge: true, resetMap: true, showQuestions: false});
    }
  },

  //this is called when a marker is clicked
  renderQuestions: function() {
    this.setState({
          resetMap          : false,
          showQuestions     : true
        }); 
  },

  render: function () {
    //at least I got this correct
    //here I'm getting all the data at once!
    var challenge = this.props.challenges[this.state.current];
    var loc     = challenge.address;
    var lat     = challenge.latitude; 
    var lng     = challenge.longitude; 
    var qa      = challenge.questions;

    var riddle     = challenge.riddle.content;
    var hint = challenge.riddle.hint;
    var solution = challenge.riddle.solution; 

    //TODO improve logic once data is retrieved from server
    var quiz = [{qtext: qa[0].content,
                 ctext: qa[0].answer,
                 atext: [qa[0].answers[0], qa[0].answers[1], qa[0].answers[2]]}];
    
    var quizForm = <Quiz onComplete={this.proceedToNext} loc={loc} quiz ={quiz} clue={riddle} clueAns={solution}/>;
    var mapForm = <Map loc={loc} lat={lat} lng={lng} renderQuestions={this.renderQuestions} resetMap={this.state.resetMap} />;

    var monsterForm = <Monster />;
    var quizDescForm = <QuizDesc />;

    //here a giant if-else statement with showQuestions

    if (this.state.showQuestions) {  //renders along with answers
      //here slide question form infront of map or along with it
      return <div><h1>{this.props.name}</h1>
              <div className="question-map-box">
                <div className="question-box">{quizForm}</div>
                <div >{mapForm}</div>
              </div>
            </div>;
    }
    else if (this.state.finalChallenge && this.props.include_final) { //after finish challenges

      return <div><Monster /></div>;
    
    }
    else { 

      return <div><h1>{this.props.name}</h1>
              <div className="row">
                <div className="col-md-3">{quizDescForm}</div>
                <div className="col-md-9">{mapForm}</div>
              </div>
            </div>;
    }
  } 
});
