var MakeAnswers = React.createClass({

  getInitialState: function(){
    return {atext: "", checked: false, logAnswer: false};
  },

  componentDidUpdate: function (prevState) {
    if(this.state.logAnswer)
      this.pass();
  },

  pass: function () {
    this.setState({logAnswer: false}); 
    this.props.passAnswers(this.props.index, this.state.atext, this.state.checked);
  },

  answerInput: function () {
    this.setState({atext: this.refs.answerInput.getDOMNode().value}); 
    
    //TODO a hack to fix in case answer text is changed but not selection
    if (this.refs.userSelect.getDOMNode().checked)
      this.props.passCorrectAnswer(this.refs.answerInput.getDOMNode().value);

    this.setState({logAnswer: true});
  },

  checkSelect: function () {
    if (this.refs.userSelect.getDOMNode().checked)
      this.props.passCorrectAnswer(this.refs.answerInput.getDOMNode().value);
  },

  render: function () {
    var style1 = {width: "90%", float: "left"  };
    var style2 = {width: "10%", float: "left", height: "25px" };
    var answer = <input type="text" style={style1} className="form-control" placeholder="Enter Answer" ref="answerInput" onChange={this.answerInput}/>;  
    var trueOrNot = <input type="radio" style={style2} className="form-control" name={this.props.question} ref="userSelect" onChange={this.checkSelect} />;  
    //return <div>{answer}&nbsp;&nbsp;<span>{trueOrNot}</span>
    return <div className="form-group">{answer}{trueOrNot}</div>;
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

  updateCorrectAnswer: function (value) {
    this.setState({answer: value});
    this.setState({log: true});
  },

  addToQuestion: function (index, choice, checked) {

    var choices = this.state.choices;

    choices[index] = {content: choice};
    
    this.setState({choices: choices});
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
    //console.log("passing question");
    this.setState({log: false});
    this.props.addToQuestions(this.props.index,
                              {content: this.state.qtext,
                               answer: this.state.answer, 
                               answers: this.state.choices});
  },

  render: function () {

    var style = {width: "90%"};
    var question = <div className="form-group"><input type="text" 
                           placeholder="Enter Question" 
                           ref="questionInput" 
                           style={style}
                           className="form-control"
                           onChange={this.questionInput}/></div>;

    //3 possible answers.... for now
    var answers = ['','',''].map(function (answer, index) {
      return (
        <div key={index}>
          <MakeAnswers question={this.state.qtext} index={index} passAnswers={this.addToQuestion}
                                                                 passCorrectAnswer={this.updateCorrectAnswer} />
        </div>
      );
    }.bind(this));

    //return <div> {question} {answers} {submitQuestion}</div>; 
    return <div className="form question-form"> {question} {answers} </div>; 
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
    this.props.addToChallenge(this.state.questions);
  },

  isReady: function () {

    var ready = true;
    //dirty fix for now
    if (this.state.questions.length >0) {
      this.state.questions.forEach(function(q) {
        if (q.answer == "" || q.answer == undefined || q.answer == null){
          ready = false; 
        }
      }.bind(this));
    }
    else
      ready = false;
    
    return ready;
  },

  render: function () {
    var arr=[]; 
    for(var i=0; i<this.state.numQuestions; i++)
      arr.push('');

      var style = {width: "90%"};
      var submitQuestions= <div className="form-group">
                            <input type="submit" 
                                   className="form-control" 
                                   style={style}
                                   value="Create Question(s)" 
                                   onClick={this.onSubmit} disabled={!this.isReady()} />
                           </div>;

    var questions = arr.map(function (question, index){
      return (
          <div key={index}>
            <CreateQuestion addToQuestions={this.addToContainer} index={index} />
          </div>
        ); 
    }.bind(this));

    return <div><h3>Questions about {this.props.loc}</h3>
                {questions}
                <div className="clearfix"></div><br/>
                <div className="text-center"><a href="#" onClick={this.addQuestion}> Add Question </a></div>
                 {submitQuestions}
           </div>; 
  
  }

});
