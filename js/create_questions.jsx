
var MakeAnswers = React.createClass({

  getInitialState: function(){
    return {atext: "", correct: false, corrrectAnswer: "", logAnswer: false};
  },

  componentDidUpdate: function (prevState) {
    //pass the answer
    if(this.state.logAnswer){
      this.pass();
      console.log("updating answers "+this.state.logCheck);}
  },

  pass: function () {
    console.log("passing answer");
    this.setState({logAnswer: false}); 
    this.props.passAnswers(this.props.index, this.state.correctAnswer, this.state.atext);
  },

  answerInput: function () {
    this.setState({atext: this.refs.answerInput.getDOMNode().value}); 
    this.setState({logAnswer: true});
  },

  checkSelect: function () {
    this.setState({correct: this.refs.userSelect.getDOMNode().checked}); 
    //TODO review code
    this.setState({correctAnswer: this.refs.answerInput.getDOMNode().value}); 
    console.log("selected value "+this.refs.answerInput.getDOMNode().value );
    this.setState({logAnswer: true});
  },

  render: function () {
    console.log("rendering render");
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

  componentDidUpdate: function (prevProps, prevState) {
    //if (prevProps.loc != this.props.loc)
    //  this.setState({choices: []}); //flush
  },

  addToQuestion: function (index, correct, choice) {
    console.log("adding answer to question index: "+index);
    var choices = this.state.choices;
    choices[index] = choice;
    //choices.push(choice);
    this.setState({choices: choices});
    this.setState({answer: correct});
    //TODO fix
    //if (correct)
    //  this.setState({answer: choice});
  },

  questionInput: function () {
    //debugger
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


    var question = <div><input type="text" 
                           placeholder="Enter Question" 
                           ref="questionInput" 
                           onChange={this.questionInput}/></div>;

    //TODO
    //var answerType = <select><option value="multiple">Multiple Choice</option></select>
    //var answerType;
    //3 possible answers.... for now
    var answers = ['','',''].map(function (answer, index) {
      return (
        <div key={index}>
          <MakeAnswers question={this.state.qtext} index={index} passAnswers={this.addToQuestion} />
        </div>
      );
    }.bind(this));

    //test
    //return <div>{question} {submitQuestion}</div>;
      //TODO investigate whey break
    return <div> {question} {answers} {submitQuestion}</div>; 
  }

});
