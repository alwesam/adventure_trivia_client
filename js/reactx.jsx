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

    //TODO do an ajax request here with server to check answers
    
    //a little hack for now to reset resubmission
    this.setState({submittedData : null});

    //constructing the correct answers
    var corr = {};
    this.props.quiz.map(function(q){corr[q.qtext]=q.ctext;});

    //assuming correctness :)
    this.setState({correct: true});

    for (var k in corr) {
      if (this.state.solutions[k] === null || //ie doesn't exist or not selected 
          this.state.solutions[k] != corr[k]) {
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

var QuizDesc = React.createClass({
  render: function () {
    var paragraph = <div> "This is a description and instructions to the adventure"</div>;
    return paragraph;
  }
});

//TODO time permitting
var Monster = React.createClass({
  render: function(){
    return <h1>"Arrrgh... prepare for combat"</h1>;
  }
});

//start the adventure
var Adventure = React.createClass({
  getInitialState: function() {
    return { current: 0, 
             showQuestions: false, 
             resetMap: false, 
             finalChallenge: false }
  },

  componentDidMount: function () {
    //TODO here do ajax request to get data
    //get the data
    //start the map and pass it the first coordinates
  },

  proceedToNext: function() {
    if (this.state.current < this.props.challenge.length-1){
      this.setState({current: this.state.current + 1});
      this.setState({showQuestions: false});
      //reset map
      this.setState({resetMap: true});
    }
    else {
      console.log("finally>>>>>>>>>>>>>>");
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
    var challenge = this.props.challenge[this.state.current];
    var loc     = challenge.loc;
    var qa      = challenge.questions;
    var clue    = challenge.clue.content;
    var clueAns = challenge.clue.answer; 
    
    //TODO improve logic once data is retrieved from server
    var quiz = [{qtext: qa[0].question,
                 ctext: qa[0].correctAnswer,
                 atext: [qa[0].answers[0], qa[0].answers[1], qa[0].answers[2]]},
                {qtext: qa[1].question,
                 ctext: qa[1].correctAnswer,
                 atext: [qa[1].answers[0], qa[1].answers[1], qa[1].answers[2]]},
                {qtext: qa[2].question,
                 ctext: qa[2].correctAnswer,
                 atext: [qa[2].answers[0], qa[2].answers[1], qa[2].answers[2]]}];
    
    var quizForm = <Quiz onComplete={this.proceedToNext} loc={loc}  quiz ={quiz} clue={clue} clueAns={clueAns}/>;
    var mapForm = <GMap loc={loc} renderQuestions={this.renderQuestions} resetMap={this.state.resetMap} />;

    var monsterForm = <Monster />;
    var quizDescForm = <QuizDesc />;

    console.log("showing questions is: "+this.state.showQuestions);

    //here a giant if-else statement with showQuestions
    if (this.state.showQuestions) 
      return <div><h1>{this.props.name}</h1>
              <div className="row">
                <div className="col-md-3">{quizForm}</div>
                <div className="col-md-9">{mapForm}</div>
              </div>
            </div>;
    else if (this.state.finalChallenge)
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

//TODO
var CreateAdventure = React.createClass({
  render: function () {
    return null;
  }
});

var ChooseAdventure = React.createClass({
  
  render: function () {
    return null;   
  }

});

//Here is the landing page
var HomePage = React.createClass({
  render: function () {
    var homePage = <div>
                    <h1>Great Adventure</h1>
                    <h3>Create an Adventure</h3>
                    <h3>Play an Adventure</h3>
                   </div>;
    return {homePage};
  }
});

var initialize = function () {
  React.render(<Adventure name= {adventure.name} challenge={adventure.challenges} />, document.getElementById("adventure"));
}

$(document).ready(function() {
  var link = 'http://maps.googleapis.com/maps/api/js?libraries=places&callback=initialize';
  $('body').append("<script src="+link+"></script>");
}); 
