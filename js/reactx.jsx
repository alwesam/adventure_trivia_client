var Answer = React.createClass({
  logCheck: function () {
    if(this.refs.radioInput.getDOMNode().checked)
      this.props.passAns(this.props.atext);
  },
  render: function() {
    return <div>
            <input type="radio" name={this.props.qtext} ref="radioInput" onChange={this.logCheck}/> {this.props.atext}  
           </div>;
  }
});

var Question = React.createClass({

  logAnswer: function (answer) {
    this.props.solution(this.props.qtext, answer);     
  },

  render: function () {
    var answers = this.props.answers.map(function(answerText) {
                                return <Answer atext = {answerText}
                                               passAns = {this.logAnswer}
                                               qtext={this.props.qtext} />
                              }.bind(this));
    return <div>
            {this.props.qtext}
            <div>
            {answers}
            </div>
           </div>;
  }
});

var Quiz = React.createClass({
  getInitialState() {
    //construct a hash k/v pair of question/answer
    var sols = {};
    //this.props.quiz.map(function(q){sols[q.qtext]=null;});
    return {submittedData: null, correct: false, solutions: sols };
  },

  receiveSolutions: function(problem, solution) {
    //solution is a single k/v pair {q : a}
    //update the k/v array of the quiz accordingly
    var s = this.state.solutions;
    //update
    s[problem] = solution;

    this.setState({solutions: s }); 

    this.checkAnswers();
    
  },

  checkAnswers: function () {

    //TODO do an ajax request here with server
    
    //a little hack for now to reset resubmission
    this.setState({submittedData : null});
    //constructing the correct answers
    var corr = {};
    this.props.quiz.map(function(q){corr[q.qtext]=q.ctext;});

    this.setState({correct: true});

    for (var k in this.state.solutions) {
      if (this.state.solutions[k] != corr[k]) {
        this.setState({correct: false});
      }
    }
  
  },

  handleSubmit: function (e, submittedData) {
    e.preventDefault();
    this.setState({submittedData});
  },

  solveClue: function () {
    var solution = this.refs.userInput.getDOMNode().value;
    //if solution is correct advance to next stage and next marker
    if (solution === this.props.clueAns) {
       this.setState({submittedData: null}) 
       this.setState({solutions: {}}) 
       this.props.onComplete();
    }
      
  },
  render: function() {
    var questions = this.props.quiz.map(function(e) {
                           return <Question solution={this.receiveSolutions} qtext={e.qtext} answers={e.atext} />;
                     }.bind(this)); 
    var quizform = <div>
             <h3>{this.props.loc}</h3>
             <AutoForm onSubmit={this.handleSubmit}>
               {questions}
               <input type="submit" value="Submit"/>
             </AutoForm>
          </div>;
    if (this.state.submittedData && this.state.correct){
      return <div>
             <h3>{this.props.loc}</h3>
             <div><strong>{this.props.clue}</strong></div>
             <input type="text" ref="userInput" />
             <input type="submit" value="Take me to the next quiz" onClick={this.solveClue}/>
          </div>;
    }
    else {
      return quizform;
    }
  }
});

//TODO time permitting
var Monster = React.createClass({
  render: function(){
    return null;
  }
});

//start the adventure
var Adventure = React.createClass({
  getInitialState: function() {
    return { current: 0 }
  },

  componentDidMount: function () {
    //here do ajax request to get data
  },

  proceedToNext: function() {
    if (this.state.current < this.props.challenge.length-1)
      this.setState({current: this.state.current + 1});
    else
      alert("meet the monster");
  },
  
  render: function () {
    var challenge = this.props.challenge[this.state.current];
    var loc     = challenge.loc;
    var qa      = challenge.questions;
    var clue    = challenge.clue.content;
    var clueAns = challenge.clue.answer; 
    
    //TODO improve logic
    var quiz = [{qtext: qa[0].question,
                 ctext: qa[0].correctAnswer,
                 atext: [qa[0].answers[0], qa[0].answers[1], qa[0].answers[2]]},
                {qtext: qa[1].question,
                 ctext: qa[1].correctAnswer,
                 atext: [qa[1].answers[0], qa[1].answers[1], qa[1].answers[2]]},
                {qtext: qa[2].question,
                 ctext: qa[2].correctAnswer,
                 atext: [qa[2].answers[0], qa[2].answers[1], qa[2].answers[2]]}];

    return <div> 
            <h1>{this.props.name}</h1>
            <Quiz onComplete={this.proceedToNext} loc={loc}  quiz ={quiz} clue={clue} clueAns={clueAns}/> 
            <GMap loc={loc} markers={[{lat: -34.397, lon: 150.644, title:"1" }, {lat: -34.9, lon: 151, title: "2"}]} />
          </div>

  } 
});

//TODO
var CreateAdventure = React.createClass({
  
  render: function () {
    return null;
  }

});

var initialize = function () {
  React.render(<Adventure name= {adventure.name} challenge={adventure.challenges} />, document.getElementById("adventure"));
}

$(document).ready(function() {
  var link = 'http://maps.googleapis.com/maps/api/js?libraries=places&callback=initialize';
  $('body').append("<script src="+link+"></script>");
}); 
