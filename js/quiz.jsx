var Answer = React.createClass({
  logCheck: function () {
    if(this.refs.radioInput.getDOMNode().checked)
      //not the best solution
      this.props.passAns(this.props.atext.content);
      //debugger
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

    /***DOWN here willl be done on server side****/
    //constructing the correct answers
    var corr = {};
    this.props.quiz.map(function(q){corr[q.qtext]=q.ctext;});

    //debugger

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
