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
            log: false,
            choices: []
            };
  },

  componentWillReceiveProps(nextProps) {},

  componentDidUpdate(prevProps, prevState) {
    if(this.state.log)
      this.pass(); 
  },

  addToQuestion: function (index, correct, choice) {
    console.log("adding answer to question index: "+index);
    var choices = this.state.choices;
    choices[index] = {content: choice};
    //choices.push(choice);
    this.setState({choices: choices});
    this.setState({answer: correct});
    this.setState({log: true});
  },

  questionInput: function () {
    //debugger
    this.setState({qtext: this.refs.questionInput.getDOMNode().value}); 
    this.setState({log: true});
    //pass the question to Quiz
  },

  //pass a prop
  pass: function () {
    console.log("passing question");
    this.setState({log: false});
    this.props.addToQuestions(this.props.index,
                              {content: this.state.qtext,
                               answer: this.state.answer, 
                               answers: this.state.choices});
  },

  //TODO remove
  onSubmit: function () {
    this.props.addToQuestions({content: this.state.qtext,
                               answer: this.state.answer, 
                               answers: this.state.choices});
  },
  //TODO ok this is messy and it causes JS errors, but it works
  isReady: function () {
    return (this.state.answer.length > 0 && this.state.choices.length > 0) 
  },

  render: function () {

    //var submitQuestion = <div><input type="submit" value="Submit Question" onClick={this.onSubmit} disabled={!this.isReady()} /></div>;

    var question = <div><input type="text" 
                           placeholder="Enter Question" 
                           ref="questionInput" 
                           onChange={this.questionInput}/></div>;

    //3 possible answers.... for now
    var answers = ['','',''].map(function (answer, index) {
      return (
        <div key={index}>
          <MakeAnswers question={this.state.qtext} index={index} passAnswers={this.addToQuestion} />
        </div>
      );
    }.bind(this));

    //return <div> {question} {answers} {submitQuestion}</div>; 
    return <div> {question} {answers} </div>; 
  }

});

var CreateQuestionsContainer = React.createClass({
  getInitialState: function(){
    return {  numQuestions: 1,
              questions: []
            };
  },

  addQuestion: function () {
    this.setState({numQuestions: this.state.numQuestions+1});
  },

  addToContainer: function (index, question_obj) {
    var arr = this.state.questions;
    arr[index] = question_obj; 
    this.setState({questions: arr});
  },

  onSubmit: function () {
    //pass an array of objects
    console.log("passing an arry of objects"+this.state.questions);
    this.props.addToChallenge(this.state.questions);
  },

  //TODO ok this is messy and it causes JS errors, but it works
  isReady: function () {
    return true; //for now
  },

  render: function () {
    var arr=[]; 
    for(var i=0; i<this.state.numQuestions; i++)
      arr.push('');

    var submitQuestions= <div><input type="submit" value="Submit Question" onClick={this.onSubmit} disabled={!this.isReady()} /></div>;

    console.log("array of questions length "+arr.length);

    //test TODO >>>>>>>>>>>>>>>>>>>>>>>>>.
    var questions = arr.map(function (question, index){
      return (
          <div key={index}>
            <CreateQuestion addToQuestions={this.addToContainer} index={index} />
          </div>
        ); 
    }.bind(this));

    return <div><h3>Questions about {this.props.loc}</h3>
                {questions}
                <div><a href="#" onClick={this.addQuestion}> Add Question </a></div>
                 {submitQuestions}
           </div>; 
  
  }

});
