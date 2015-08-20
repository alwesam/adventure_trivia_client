import React from 'react';  
import Router from 'react-router';  
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';

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
            questionIndex: 0,
            hearts: 3,
            gameOver: false,
            questionsCompleted: false,
            warning: "",
            solution: "" };
  },

  componentDidMount: function () {
    //TODO here do an AJAX request to get questions
  },

  componentDidUpdate: function (prevProps, prevState) {
    //reset completed
    if(this.props.quiz != prevProps.quiz)
      this.setState({questionsCompleted: false});

    if(prevState.submittedData === null && this.state.submittedData) {

      this.setState({submittedData : null}); //reset to prevent resubmission
      if(this.checkAnswers()) {
        this.setState({warning: ""});

        if(this.state.questionIndex < this.props.quiz.length -1){
          //signal to map to move on to the next question
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
        this.props.minusheart();
        if(this.props.hearts == 1) //game over
          this.setState({gameOver: true});
        else {
          this.setState({warning: "Incorrect Answer, Try Again"});
        }
      }

    }//finished checking

    if (this.state.questionIndex != prevState.questionIndex && this.state.questionsCompleted === false)
      this.questionSolved();
        
  },

  questionSolved: function () {
    this.props.questionDone(this.props.quiz[this.state.questionIndex].content);
  },

  receiveSolution: function(problem, solution) {
    //TODO revise
    if(problem === this.props.quiz[this.state.questionIndex].content)
      this.setState({solution: solution }); 
    
  },

  checkAnswers: function () {
    //TODO do an AJAX request here with server to check answers
    return (this.state.solution === this.props.quiz[this.state.questionIndex].answer);
  },

  handleSubmit: function (e, submittedData) {
    e.preventDefault();
    this.setState({submittedData});
  },

  solveClue: function () {
    var solution = this.refs.userInput.getDOMNode().value;
    //if solution is correct advance to next stage and next marker
    if (solution.toUpperCase() === this.props.clueAns.toUpperCase()) {
       this.setState({warning: ""});
       this.setState({submittedData: null});
       this.setState({solutions: {}});
       //signal to update to next location
       this.props.onComplete();
    }
    else {
      this.props.minusheart();
      if(this.props.hearts == 1) //game over
        this.setState({gameOver: true});
      else
        this.setState({warning: "Incorrect, try again. Hint: "+this.props.clueHint}); 
    }
  },
  
  render: function() {

    var qObj = this.props.quiz[this.state.questionIndex];
    var qtext = qObj.content; //return a string
    var atext = qObj.answers; //return an array of answer objects

    var question = <Question solution={this.receiveSolution} qtext={qtext} answers={atext} />;

    var warning_style = {color: "red"};

    var quizform = <div>
             <h3>{this.props.loc}</h3>
             <AutoForm onSubmit={this.handleSubmit}>
               {question}
               <input type="submit" value="Submit"/>
             </AutoForm>
             <div style={warning_style}>
              {this.state.warning}
             </div>
          </div>;

    var find_ruby = <div className="text-center"> Let's find some rubies. </div>;
    var next_ruby = <div className="text-center"> Awesome, find the next ruby. Embrace the adventure. </div>;

    var gameover = <div> GAME OVER <h4><Link to="/play">Restart</Link></h4></div>

    var riddle = (this.props.finalStage) ? <h4> You are getting close. Solve this riddle and you will be faced with the final challenge </h4> : 
                                           <h4> Solve riddle to move on to your next adventure location</h4>;

    if(this.state.gameOver)
      return gameover;
    if (this.state.questionsCompleted){
      return <div>
             <div>{riddle}</div> 
             <div><strong>{this.props.clue}</strong></div>
             <div className="form-group"><input className="form-control" type="text" ref="userInput" /></div>
             <div className="form-group"><input className="form-control" type="submit" value="Take me to the next adventure" onClick={this.solveClue}/></div>
             <div style={warning_style}>
              {this.state.warning}
             </div>
          </div>;
    }
    else if (this.props.showQuestions) {
      return quizform; 
    }
    else if (this.props.toggleInstruct) {
      return next_ruby;
    }
    else {
      return find_ruby;
    }
  }
});

export default Quiz;
