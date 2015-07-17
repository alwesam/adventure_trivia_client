var MakeRiddle = React.createClass({

  getInitialState: function(){
    return {rtext: "", htext: "", ltext: ""};
  },

  riddleInput: function () {
    this.setState({rtext: this.refs.riddleInput.getDOMNode().value}); 
    //pass the riddle object 
    this.props.makeRiddle({content: this.state.rtext, 
                           hint: this.state.htext, 
                           solution: this.state.ltext});
  },

  hintInput: function () {
    this.setState({htext: this.refs.hintInput.getDOMNode().value}); 
  },

  solInput: function () {
    this.setState({ltext: this.refs.solInput.getDOMNode().value}); 
  },

  render: function () {
    var riddle = <div><input type="text" placeholder="Enter Riddle" ref="riddleInput" onChange={this.riddleInput}/></div>;  
    var hint = <div><input type="text" placeholder="Enter Hint" ref="hintInput" onChange={this.hintInput}/></div>;  
    var sol = <div><input type="text" placeholder="Enter Solution" ref="solInput" onChange={this.solInput}/></div>;  
    return <div>{riddle}{hint}{sol}</div>;
  }

});

////////////////////////////////
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
    this.props.addToQuiz({content: this.state.qtext,
                          answer: this.state.answer, 
                          answers: this.state.choices});
  },
    
  //TODO
  answerType: function () {
    
  },

  render: function () {
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
                {answers}
           </div>; 
  }

});

//////////////////////////
var CreateQuiz = React.createClass({

  getInitialState: function(){
    return {  numQuestions: 1,
              loc: "",
              riddle: {},
              questions: []
            };
  },

  addQuestion: function () {
    this.setState({numQuestions: this.state.numQuestions+1});
  },

    //this function gets called from Riddle component
  buildRiddle: function (obj) {

    this.setState({riddle: obj});
    
    //pass the Quiz or challenge or stage to adventure
    this.props.addToAdventure(this.props.index,
                              {address : this.props.loc,
                               riddle: this.state.riddle, 
                               questions: this.state.questions 
                              });
  },

    //this function gets called from Question component
  addToQuiz: function (index, obj) {
    var questions = this.state.questions;
    questions[index] = obj;
    this.setState({questions: questions});
  },

  render: function () {
    var arr=[]; 
    for(var i=0; i<this.state.numQuestions; i++)
      arr.push('');

    console.log("array of questions length "+arr.length);

    var questions = arr.map(function (question, index){
      return (
          <div key={index}>
            <CreateQuestion addToQuiz={this.addToQuiz} />
          </div>
        ); 
    }.bind(this));
    var riddle = <div><MakeRiddle makeRiddle={this.buildRiddle} /></div>;
    var riddle;
    return <div><h3>Questions about {this.props.loc}</h3>
                {questions}
                {riddle}
                <div><a href="#" onClick={this.addQuestion}> Add Question </a></div>
           </div>; 
  }

});

//////////////////////////////
var CreateAdventure = React.createClass({
  getInitialState: function () {
    return {
              adventureTitle: "",
              adventureDescription: "",
              adventureChallenges: [],
              includeFinal: false,
              jsonError: false
            };
  },

  addAdventureObject: function (index, obj) {
    console.log("object to be plastered ", obj);
    console.log("adventure challenges length "+this.state.adventureChallenges.length);
    var challenge = this.state.adventureChallenges;
    challenge[index] = obj;
    //Test
    this.setState({adventureChallenges: challenge});
  },

    //TODO use form instead
  onSubmit: function () {
    
    //send data to server
    var data = {title: this.state.adventureTitle,
               description: this.state.adventureDescription,
               challenges : this.state.adventureChallenges,
               include_final: this.state.includeFinal
              } 

    //check data
    //console.log(data);
    //console.log(JSON.stringify(data));

    //use to test data
    var challenges = [];
    challenges [0] = {address: "Rome, Italy", 
                    riddle: {content: "What's a riddle?", hint: "It's obvious", solution: "It's a riddle"}, 
                    questions: [{content : "What's the capital of Italy", answer: "Rome", answers: [{content: "Rome"},{content: "Naples"},{content: "Paris"}]}]};

    challenges [1] = {address: "Naples, Italy", 
                    riddle: {content: "What's a riddle?", hint: "It's obvious", solution: "It's a riddle"}, 
                    questions: [{content : "What's the capital of Italy", answer: "Rome", answers: [{content: "Rome"},{content: "Naples"},{content: "Paris"}]}]};

    var datatest = {adventure : {title: "Indiana goes to Italy",
               description: "Indiana kicks ass",
               challenges : challenges,
               include_final: true 
              }} 

    var url ="http://localhost:3000/adventures"; 
    
    $.ajax({
      type: "POST",
      url: url,
      data: datatest,
      success: function (data) {
        console.log(data);
      }.bind(this)
    });

  },

  nameInput: function () {
    this.setState({adventureTitle: this.refs.nameInput.getDOMNode().value}); 
  },

  locInput: function () {
    var locString = this.refs.locInput.getDOMNode().value; 
    this.setState({adventureChallenges: locString.trim().split(";") }); 
  },

  checkGame: function () {
    this.setState({finalChallenge: this.refs.checkGame.getDOMNode().checked});
  },

  descInput: function () {
    this.setState({adventureDescription: this.refs.descInput.getDOMNode().value}); 
    //console.log(this.state.adventureDescription);
  },

  isReady: function () {
    return (this.state.adventureTitle.length > 0 &&
            this.state.adventureDescription.length >0 &&
            this.state.adventureChallenges.length > 0); 
  },

  render: function () {
    var name = <input type="text" placeholder="Enter Name of Adventure" ref="nameInput" onChange={this.nameInput}/>;  
    
    var description = <textarea name="description" placeholder="Enter a description" ref="descInput" onChange={this.descInput} />;  

    var locsBox = <textarea name="locations" placeholder="Enter Locations separated by semicolon" ref="locInput" onChange={this.locInput}/>;  

    var quiz = this.state.adventureChallenges.map(function (loc, index) {
                       
                       return <CreateQuiz loc={loc} index={index} addToAdventure={this.addAdventureObject} />;
                    }.bind(this));
    
    var includeGame = <div><input type="checkbox" ref="checkGame" onChange={this.checkGame}/>
                           <strong>Include Final Challenge? </strong></div>;  
 
    var submitButton = <input type="submit" value="Create Adventure" onClick={this.onSubmit} disabled={!this.isReady()} />;

    return <div>
             <h1 className="text-center">Create your Own Adventure</h1>
             <div>{name}</div>
             <div>{description}</div>
             <div>{locsBox}</div>
             <div>{quiz}</div>
             <div>{includeGame}</div>
             <div>{submitButton}</div>
           </div>;   
  }
});
