var Answer = React.createClass({
  logCheck: function () {
    if(this.refs.radioInput.getDOMNode().checked)
      this.props.passAns(this.props.atext);
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

var Monster = React.createClass({

  getInitialState: function () {
    return {won: false, loss: false};
  },

  gameWon: function () {
    this.setState({won: true});
  },

  gameLost: function () {
    this.setState({loss: true});
  },

  render: function(){
    var monster = <h1>"Arrrgh... prepare for combat"</h1>;
    //Temp
    var link = <h2><a href="#" onClick={this.gameWon}>OK you won</a></h2>;
    ////
    var finalPage = <FinalPage />;
    var finalPageLost = <FinalPageLost />;
    if (this.state.won)
      return <div>{finalPage}</div>;
    else if (this.state.loss)
      return <div>{finalPageLost}</div>;
    else
      return <div>{monster} {link}</div>; 
  }

});


var Review = React.createClass({
  getInitialState: function () {
    return {rating: 0};
  },
    
  //ask an expert in react
  rate: function () {
    this.setState({rating: this.refs.starInput.getDOMNode().value});
   // this.setState({ratingText: this.state.rating+" stars"});
    this.props.text(this.state.rating);
  },

  render: function () {
    return  <input type="radio" name="rating" value={this.props.value} ref="starInput" onChange={this.rate}/>
  }

});


var FinalPage = React.createClass({

  getInitialState: function () {
    return {rating: 0, ratingText: "Choose a rating"};
  },

  //ask an expert in react
  //it's retarded but couldn't find an other way that doesn't involve webpack or
  //browsify (till now)
  //make an ajax request to send rating to server
  rate1: function () {
    this.setState({rating: this.refs.star1Input.getDOMNode().value});
    this.setState({ratingText: this.refs.star1Input.getDOMNode().value+" stars"});
  },
  rate2: function () {
    this.setState({rating: this.refs.star2Input.getDOMNode().value});
    this.setState({ratingText: this.refs.star2Input.getDOMNode().value+" stars"});
  },
  rate3: function () {
    this.setState({rating: this.refs.star3Input.getDOMNode().value});
    this.setState({ratingText: this.refs.star3Input.getDOMNode().value+" stars"});
  },
  rate4: function () {
    this.setState({rating: this.refs.star4Input.getDOMNode().value});
    this.setState({ratingText: this.refs.star4Input.getDOMNode().value+" stars"});
  },
  rate5: function () {
    this.setState({rating: this.refs.star5Input.getDOMNode().value});
    this.setState({ratingText: this.refs.star5Input.getDOMNode().value+" stars"});
  },

  postReview: function(value) {
    //make a post request to post review 
  }, 

  render: function(){

    var image = <div><img src={'img/wisely.jpg'} /></div>;

    //This is my proudest achievement :-P
    var stars = <span className="star-rating">
                   <input type="radio" name="rating" value="1" ref="star1Input" onChange={this.rate1}/><i></i>
                   <input type="radio" name="rating" value="2" ref="star2Input" onChange={this.rate2}/><i></i>
                   <input type="radio" name="rating" value="3" ref="star3Input" onChange={this.rate3}/><i></i>
                   <input type="radio" name="rating" value="4" ref="star4Input" onChange={this.rate4}/><i></i>
                   <input type="radio" name="rating" value="5" ref="star5Input" onChange={this.rate5}/><i></i>
                 </span>;

    /**didn't work :-(
    var stars = ['','','','',''].map(function (s, i) {
        return <span key={i} className="star-rating">
                 <Review text={this.showRating} value={i+1} /><i></i>; 
               </span>;
    });*/ 

    var inviteFriends = <h4><a href="#">Invite your friends</a></h4>;

    return <div>
            <h1>Congratulations!</h1>
            {image}
            <div>{stars}</div>
            <div><strong>{this.state.ratingText}</strong></div>
            {inviteFriends}
           </div>; 
  }
});

var FinalPageLost = React.createClass({

  render: function(){
    var image = <div><img src={'img/poorly.jpg'} /></div>;

    return (
      <div>
      {image}
      </div>); 
  }
});

//start the adventure
var PlayAdventure = React.createClass({
  getInitialState: function() {
    return { current: 0, 
             showQuestions: false, 
             resetMap: false, 
             finalChallenge: false }
  },

  componentDidMount: function () {
    //TODO here do ajax request to get data
    //get the data
    //start the map and pass it the first coordinates
  },

  proceedToNext: function() {
    if (this.state.current < this.props.challenge.length-1){
      this.setState({current: this.state.current + 1});
      this.setState({showQuestions: false});
      //reset map
      this.setState({resetMap: true});
    }
    else {
      this.setState({finalChallenge: true});
      this.setState({resetMap: true});
      this.setState({showQuestions: false});
    }
  },

  renderQuestions: function() {
    //TODO review this dirty hack
    this.setState({resetMap: false});
    this.setState({showQuestions: true}); 
  },
  
  render: function () {
    var challenge = this.props.challenge[this.state.current];
    var loc     = challenge.loc;
    var qa      = challenge.questions;
    var clue    = challenge.clue.content;
    var clueHint= challenge.clue.hint;
    var clueAns = challenge.clue.answer; 
    
    //TODO improve logic once data is retrieved from server
    var quiz = [{qtext: qa[0].content,
                 ctext: qa[0].correctAnswer,
                 atext: [qa[0].answers[0], qa[0].answers[1], qa[0].answers[2]]},
                {qtext: qa[1].content,
                 ctext: qa[1].correctAnswer,
                 atext: [qa[1].answers[0], qa[1].answers[1], qa[1].answers[2]]},
                {qtext: qa[2].content,
                 ctext: qa[2].correctAnswer,
                 atext: [qa[2].answers[0], qa[2].answers[1], qa[2].answers[2]]}];
    
    var quizForm = <Quiz onComplete={this.proceedToNext} loc={loc}  quiz ={quiz} clue={clue} clueAns={clueAns}/>;
    var mapForm = <GMap loc={loc} renderQuestions={this.renderQuestions} resetMap={this.state.resetMap} />;

    var monsterForm = <Monster />;
    var quizDescForm = <QuizDesc />;

    //console.log("showing questions is: "+this.state.showQuestions);

    //here a giant if-else statement with showQuestions
    if (this.state.showQuestions) 
      return <div><h1>{this.props.name}</h1>
              <div className="row">
                <div className="col-md-3">{quizForm}</div>
                <div className="col-md-9">{mapForm}</div>
              </div>
            </div>;
    else if (this.state.finalChallenge)
      return <div><Monster /></div>;
    else 
      return <div><h1>{this.props.name}</h1>
              <div className="row">
                <div className="col-md-3">{quizDescForm}</div>
                <div className="col-md-9">{mapForm}</div>
              </div>
            </div>;

  } 
});

var Adventure = React.createClass({

  getInitialState: function () {
    return {description: "",
            play       : false,
            challenge       : [],
            detailsFetched: false}
  },
  fetchDetails: function () {
    //TODO fetch details from JSON later 
    this.setState({description: "Hello Indy"});
    this.setState({detailsFetched: true}) 
    this.setState({challenge: adventure.challenges}) 
  },

  startAdventure: function () {
    this.setState({play: true});
  },

  render: function () {
    if (this.state.play) {
      //TODO finish
      return <PlayAdventure name= {this.props.name} challenge={this.state.challenge} />
    }
    else if (this.state.detailsFetched) {
      return <div>
               <h3>{this.props.name}</h3>
               <p>{this.state.description}</p>
               <button href="#" onClick={this.startAdventure}>Play</button>
             </div>;
    }
    else {
      return <div>
              <a href="#" onClick={this.fetchDetails}> {this.props.name}</a>
             </div>;
    }
  }

});

//TODO
var Adventures = React.createClass({
  getInitialState: function () {
    return {adventures: [], showSpinner: true}
  },

  componentDidMount: function () {
    //TODO make an ajax request
    //for now just do the following
    var data = [{"name": "Find the Holy Grail", "description": "Indy!!!"}];
    this.setState({adventures: data});
    this.setState({showSpinner: false});
  },

  render: function () {
    
    var adventures = this.state.adventures.map(function(a) {
      return <Adventure name={a.name} />; //don't forget the id
    });
    var spinnerDisplay = this.state.showSpinner ? "block" : "none";
    var spinnerStyle   = {display: spinnerDisplay};
    return <div className="text-center">
             <div style={spinnerStyle}>Loading...</div>
             {adventures}
           </div>;
  }
});

//Here is the landing page
var HomePage = React.createClass({
  getInitialState: function () {
    return {createAdventure: false, playAdventure: false}
  },

  play: function () {
    this.setState({playAdventure: true});
  },

  create: function () {
    this.setState({createAdventure: true});
  },

  render: function () {

    var homePage = <div className="text-center container">
                     <h1>Welcome to Adventure Trivia</h1>
                     <h3><a href="#" onClick={this.create}>Create an Adventure</a></h3>
                     <h3><a href="#" onClick={this.play}>Play an Adventure</a></h3>
                   </div>;

    if (this.state.createAdventure)
      return <div className="container"><CreateAdventure /></div>;
    else if (this.state.playAdventure)
      return <div className="container"><Adventures /></div>;
    else
      return homePage;

  }
});

var initialize = function () {
  //for now
  //React.render(<PlayAdventure name= {adventure.name} challenge={adventure.challenges} />, document.getElementById("adventure"));
  React.render(<HomePage />, document.getElementById("adventure"));
}

$(document).ready(function() {
  var link = 'http://maps.googleapis.com/maps/api/js?libraries=places&callback=initialize';
  $('body').append("<script src="+link+"></script>");
}); 
