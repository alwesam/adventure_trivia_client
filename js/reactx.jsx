var adventure = {
  name: "Find Holy Grail",
  challenges: [
        {
          loc: "Rome, Italy",
          questions: [
                      {"question" : "What is the capital of Spain?", 
                       "correctAnswer": "Madrid", 
                       "answers" :
                        ["Madrid", 
                         "London", 
                         "Istanbul"]
                      }, 

                      {"question" : "What is the capital of Austria?", 
                       "correctAnswer" : "Vienna",
                       "answers" :
                        ["Madrid", 
                        "Vienna", 
                        "Berlin"]
                      }, 

                      {"question" : "What is the capital of Poland?", 
                       "correctAnswer" : "Warsaw",
                       "answers"  :
                        ["Madrid", 
                        "Vienna", 
                        "Warsaw"]
                      } 
          ],
          clue: {"content" : "closest metropolis to the pyramids", "answer" : "cairo"},
          statusComplete: false
        }, 
        {
          loc: "Giza Necropolis, Giza, Egypt",
          questions: [
                      {"question" : "What is the capital of Egypt?", 
                       "correctAnswer" : "Cairo",
                       "answers" :
                        ["Cairo", 
                         "Amman", 
                         "Istanbul"]
                      }, 

                      {"question" : "What is the capital of Iraq?", 
                       "correctAnswer" : "Baghdad",
                       "answers" :
                        ["Baghdad", 
                        "Damascus", 
                        "Beirut"]
                      }, 

                      {"question" : "What is the capital of Libya?", 
                       "correctAnswer" : "Tripoli",
                       "answers"  :
                        ["Cairo", 
                        "Tripoli", 
                        "Khartoum"]
                      } 
          ],
          clue: {"content" : "Indian Jones was there", "answer" : "petra"},
          statusComplete: false
        }, 
        {
          loc: "Petra, Kingdom of Jordan",
          questions: [
                      {"question" : "What is the capital of Iran?", 
                       "correctAnswer" : "Tehran",
                       "answers" :
                        ["Delhi", 
                         "Tehran", 
                         "Istanbul"]
                      }, 

                      {"question" : "What is the capital of Qatar?", 
                       "correctAnswer" : "Doha",
                       "answers" :
                        ["Kuwait", 
                        "Jerusalem", 
                        "Doha"]
                      }, 

                      {"question" : "What is the capital of Oman?", 
                       "correctAnswer" : "Muscat",
                       "answers"  :
                        ["Muscat", 
                        "Dubai", 
                        "Manama"]
                      } 
          ],
          clue: {"content" : "What is one plus one", "answer" : "two"},
          statusComplete: false
        } 
  ],
  finalChallenge: "Game"
}; 

var Answer = React.createClass({
  getInitialState: function(){
    return null; 
  },
  render: function() {
    return <div>
            <input type="radio" name={this.props.qtext} /> {this.props.atext}  
           </div>;
  }
});

var Question = React.createClass({
  render: function () {
    var answers = this.props.answers.map(function(answerText) {
                                return <Answer atext={answerText}
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
    return {submittedData: null, completed: false};
  },

  handleSubmit(e, submittedData) {
    e.preventDefault();
    this.setState({submittedData});
  },

  solveClue: function () {
    var solution = this.refs.userInput.getDOMNode().value;
    //if solution is correct advance to next stage and next marker
    if (solution === this.props.clueAns) {
       this.setState({completed: true}) 
       this.setState({submittedData: null}) 
       this.props.onComplete();
    }
      
  },
  render: function() {
    var questions = this.props.quiz.map(function(e) {
                           return <Question qtext={e.qtext} answers={e.atext} />;
                     }); 
    var quizform = <div>
             <h3>{this.props.loc}</h3>
             <AutoForm onSubmit={this.handleSubmit}>
               {questions}
               <input type="submit" value="Submit"/>
             </AutoForm>
          </div>;
    //TODO solve logic
    if (this.state.submittedData){
      //console.log(JSON.stringify(this.state.submittedData, null, 3));
      return <div>
             <h3>{this.props.loc}</h3>
             <div><strong>{this.props.clue}</strong></div>
             <input type="text" ref="userInput" />
             <input type="submit" value="Take me to the next quiz" onClick={this.solveClue}/>
          </div>;}
    else
      return quizform;
  }
});


//TODO time permitting
var Monster = React.createClass({

  render: function(){
    return null;
  }
  
});

var Adventure = React.createClass({
  getInitialState: function() {
    return { current: 0 }
  },

  componentDidMount: function () {
    //here do ajax request to get data
  },

  proceedToNext: function() {
    if (this.state.current < this.props.challenge.length-1)
      this.setState({current: this.state.current + 1});
    else
      alert("meet the monster");
  },
  
  render: function () {
    var challenge = this.props.challenge[this.state.current];
    console.log(challenge);
    var loc     = challenge.loc;
    var qa      = challenge.questions;
    var clue    = challenge.clue.content;
    var clueAns = challenge.clue.answer; 

    var quiz = [{qtext: qa[0].question,
                 atext: [qa[0].answers[0], qa[0].answers[1], qa[0].answers[2]]},
                {qtext: qa[1].question,
                 atext: [qa[1].answers[0], qa[1].answers[1], qa[1].answers[2]]},
                {qtext: qa[2].question,
                 atext: [qa[2].answers[0], qa[2].answers[1], qa[2].answers[2]]}];

    return <div> 
            <h1>{this.props.name}</h1>
            <Quiz onComplete={this.proceedToNext} loc={loc}  quiz ={quiz} clue={clue} clueAns={clueAns}/> 
          </div>

  } 
});

//TODO
var CreateAdventure = React.createClass({
  
  render: function () {
    return null;
  }

});


React.render(<Adventure name= {adventure.name} challenge={adventure.challenges} />, document.getElementById("question-form"));
