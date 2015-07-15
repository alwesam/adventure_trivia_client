var MakeRiddle = React.createClass({

  getInitialState: function(){
    return {rtext: "", htext: "", ltext: ""};
  },

  riddleInput: function () {
    this.setState({rtext: this.refs.riddleInput.getDOMNode().value}); 
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

var MakeAnswers = React.createClass({

  getInitialState: function(){
    return {atext: "", correct: false};
  },

  answerInput: function () {
    this.setState({atext: this.refs.answerInput.getDOMNode().value}); 
  },

  checkSelect: function () {
    if (this.refs.userSelect.getDOMNode().checked) {
      this.setState({correct: true}); 
    }
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
            answerType: null};
  },

  questionInput: function () {
    this.setState({qtext: this.refs.questionInput.getDOMNode().value}); 
  },
    
  //TODO
  answerType: function () {
    
  },

  render: function () {
    var question = <input type="text" 
                           placeholder="Enter Question" 
                           ref="questionInput" 
                           onChange={this.questionInput}/>;

    var answerType = <select><option value="multiple">Multiple Choice</option></select>
    //3 possible answers.... for now
    //TODO fix that
    //also add ability to select type of answering
    //1) mutliple choice (radio)
    //2) true or false 
    //3) text input 
    //do If else statement
    var answers = ['a','b','c'].map(function (answer, index) {
      return (
        <div key={index}>
          <MakeAnswers question={this.state.qtext} index={index}/>
        </div>
      );
    }.bind(this));

    return <div>
                <div>{question} {answerType}</div>
                {answers}
           </div>; 
  
  }

});

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

  constructQuiz: function () {
    
    var obj = {"location" : this.props.loc,
               "riddle": this.state.riddle, 
               "question": this.state.questions 
               };
    this.props.addToAdventure(this.props.index, index);
  },

  render: function () {
   
    var arr=[]; 
    for(var i=0; i<this.state.numQuestions; i++)
      arr.push('');

    var questions = arr.map(function (question, index){
      return (
          <div key={index}>
            <CreateQuestion />
          </div>
        ); 
    }.bind(this));

    var riddle = <div><MakeRiddle /></div>;

    return <div><h3>Questions about {this.props.loc}</h3>
                {questions}
                {riddle}
                <div><a href="#" onClick={this.addQuestion}> Add Question </a></div>
           </div>; 
  }

});

var CreateAdventure = React.createClass({
  getInitialState: function () {
    return {
              adventureName: "",
              adventureDescription: "",
              adventureChallenges: [],
              finalChallenge: false,
              jsonError: false
            };
  },

  addAdventureObject: function (index, obj) {
    var challenge = this.state.adventureChallenges;
    challenge[index] = obj;
    this.setState({adventureChallenges: challenge});
  },

    //TODO use form instead
  onSubmit: function () {
    //TODO make an ajax post request to
    //send data to server
    var url ="http://localhost:3000"; 
    var data= {"name": this.state.adventureName,
               "description": this.state.adventureDescription,
               "challenges" : this.state.adventureChallenges,
               "finalChallenge": this.state.finalChallenge
              }

    $.ajax({
      type: "POST",
      url: url,
      data: data,
      success: function (data) {
        console.log(data);
      }.bind(this)
    });

  },

  nameInput: function () {
    this.setState({adventureName: this.refs.nameInput.getDOMNode().value}); 
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
    console.log(this.state.adventureDescription);
  },

  isReady: function () {
    return (this.state.adventureName.length > 0 &&
            this.state.adventureDescription.length >0 &&
            this.state.adventureChallenges.length > 0); 
  },

  render: function () {
    var name = <input type="text" placeholder="Enter Name of Adventure" ref="nameInput" onChange={this.nameInput}/>;  
    
    var description = <textarea name="description" placeholder="Enter a description" ref="descInput" onChange={this.descInput} />;  

    var locsBox = <textarea name="locations" placeholder="Enter Locations separated by semicolon" ref="locInput" onChange={this.locInput}/>;  

    var quiz = this.state.adventureChallenges.map(function (loc, index) {
                       return <CreateQuiz loc={loc} index={index} />;
                    });
    
    var includeGame = <div><input type="checkbox" ref="checkGame" onChange={this.checkGame}/>
                           <strong>Include Final Challenge? </strong></div>;  
 
    var submitButton = <input type="submit" value="Create Adventure" disabled={!this.isReady()} />;

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
