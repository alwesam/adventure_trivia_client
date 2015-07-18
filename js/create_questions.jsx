
var MakeAnswers = React.createClass({

  getInitialState: function(){
    return {atext: "", correct: false};
  },

  answerInput: function () {
    this.setState({atext: this.refs.answerInput.getDOMNode().value}); 
    //pass the answer
    this.props.passAnswers(this.props.index, this.state.correct, this.state.atext);
  },

  checkSelect: function () {
    this.setState({correct: this.refs.userSelect.getDOMNode().checked}); 
  },

  render: function () {
    var answer = <input type="text" placeholder="Enter Answer" ref="answerInput" onChange={this.answerInput}/>;  
    var trueOrNot = <input type="radio" name={this.props.question} ref="userSelect" onChange={this.checkSelect} />;  
    return <div>{answer}&nbsp;&nbsp;<span>{trueOrNot}</span></div>;
  }

});

var CreateQuestion = React.createClass({
  getInitialState: function(){
    return {qtext: "",
            answer: "",
            choices: [],
            answerType: null};
  },

  addToQuestion: function (index, correct, choice) {

    var choices = this.state.choices;
    choices[index] = choice;
    this.setState({choices: choices});

    if (correct)
      this.setState({answer: choice});

  },

  questionInput: function () {
    this.setState({qtext: this.refs.questionInput.getDOMNode().value}); 
    //pass the question to Quiz
  },

  onSubmit: function () {

    this.props.addToQuestions({content: this.state.qtext,
                               answer: this.state.answer, 
                               answers: this.state.choices});
  
  },
    
  //TODO
  answerType: function () {
    
  },

  render: function () {

    var submitQuestion = <div><input type="submit" value="Submit Question" onClick={this.onSubmit} /></div>;


    var question = <input type="text" 
                           placeholder="Enter Question" 
                           ref="questionInput" 
                           onChange={this.questionInput}/>;

    //TODO
    //var answerType = <select><option value="multiple">Multiple Choice</option></select>
    var answerType;
    //3 possible answers.... for now
    var answers = ['','',''].map(function (answer, index) {
      return (
        <div key={index}>
          <MakeAnswers question={this.state.qtext} index={index} passAnswers={this.addToQuestion} />
        </div>
      );
    }.bind(this));

    return <div>
                <div>{question} {answerType}</div>
                {answers} {submitQuestion}
           </div>; 
  }

});
