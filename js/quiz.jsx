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
    return {submittedData: null, 
            correct: false, 
            questionIndex: 0,
            questionsCompleted: false,
            solutions: {} };
  },

  componentDidMount: function () {
    
    //TODO here do an AJAX request to get questions
  
  },

  componentDidUpdate: function (prevProps, prevState) {
    //reset completed
    if(this.props.quiz != prevProps.quiz)
      this.setState({questionsCompleted: false});

    if(prevState.submittedData === null && this.state.submittedData) {

      if(this.checkAnswers()) {
        this.setState({submittedData : null});

        if(this.state.questionIndex < this.props.quiz.length -1){
          //signal to map to move on to the next question
          //this.questionSolved(); 
          //advance to the nex question and clue
          this.setState({questionIndex: this.state.questionIndex+1});
        }
        else {
          //finished questions now the clue
          this.setState({questionIndex: 0});
          this.setState({questionsCompleted: true});
        }

      } //checking answers
      else {
        //TODO render it in HTML
        console.log ("Incorrect Answer, Try again");
      }

    }//finished checking

    if (this.state.questionIndex != prevState.questionIndex && this.state.questionsCompleted === false)
      this.questionSolved();
        
  },

  //got it from stackoverflow
  makeid: function () {
  
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  },

  questionSolved: function () {
    //here call playadventure which calls map and marker to move into the next
    //question 
    console.log("question solved>>>>>>>>>>>>>>>");
    //TODO do some work here for pattern matching
    //this.props.questionDone("Kingston, Ontario, Canada");
    //this.props.questionDone(this.state.questionIndex);
    this.props.questionDone(this.makeid());
  },

  receiveSolutions: function(problem, solution) {
    //solution is a single k/v pair {q : a}
    //update the k/v array of the quiz accordingly
    var s = this.state.solutions;
    //update
    s[problem] = solution;
    this.setState({solutions: s }); 
    
  },

  checkAnswers: function () {

    //TODO do an AJAX request here with server to check answers
    
    //a little hack for now to reset resubmission
    //this.setState({submittedData : null});

    /***DOWN here willl be done on server side****/
    //constructing the correct answers
    //TODO comment out for testing
    //var corr = {};
    //this.props.quiz.map(function(q){corr[q.qtext]=q.ctext;});

    //TODO comment out for testing
    //for (var k in corr) {
    //  if (this.state.solutions[k] === null || //ie doesn't exist or not selected 
    //      this.state.solutions[k] != corr[k]) {
    //    return false;
    //  }
    //}
    
    return true;

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
       //signal to update to next location
       this.props.onComplete();
    }
  },

  render: function() {

    console.log("current question stage.>>>>>>>>>>>>>>> "+this.state.questionIndex);

    var qObj = this.props.quiz[this.state.questionIndex];
    var qtext = qObj.content; //return a string
    var atext = qObj.answers; //return an array of answer objects

    var question = <Question solution={this.receiveSolutions} qtext={qtext} answers={atext} />;

    var quizform = <div>
             <h3>{this.props.loc}</h3>
             <AutoForm onSubmit={this.handleSubmit}>
               {question}
               <input type="submit" value="Submit"/>
             </AutoForm>
          </div>;

    var paragraph = <div> This is a description and instructions to the adventure </div>;

    if (this.state.questionsCompleted){
      return <div>
             <h3>{this.props.loc}</h3>
             <div><strong>{this.props.clue}</strong></div>
             <input type="text" ref="userInput" />
             <input type="submit" value="Take me to the next quiz" onClick={this.solveClue}/>
          </div>;
    }
    else if (this.props.showQuestions) {
      return quizform; 
    }
    else {
      return paragraph;
    }

  }

});
