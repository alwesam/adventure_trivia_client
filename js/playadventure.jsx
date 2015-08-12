//start the adventure, this will be a new page
var PlayAdventure = React.createClass({

  getInitialState: function() {
    return { current: 0, 
             challengeID: 0,
             showQuestions: false, 
             gameLoaded: false,
             restart: false,
             nextStop: "",
             hearts: 3,
             resetMap: false, 
             finalStage: false,
             finalChallenge: false }
  },

  componentDidUpdate: function(prevState) {
    //if(prevState.gameLoaded != this.state.gameloaded)
    //  if (this.state.challenges.length-1 == 0) 
    //      this.setState({finalStage: true});
  },

  componentDidMount: function () {
    //TODO ajax request to details including questions
    //off the challenge ID
    //questions and riddles
    //pass the token as well
    $.ajax({
      url: "http://localhost:3000/adventures/"+this.props.adventure_id+"?token="+this.props.adventure_token,
      method: "GET",
      success: function(data){
        console.log("here are the details of adventure >>>>>>>>>>>>>>>>>");
        console.log(data);
        this.setState({
          challenges: data.challenges,
          gameLoaded: true
        }); 
      }.bind(this)
    });

  },

  proceedToNextQuestion: function (value) {
    console.log("incrementing question>>>>>>>>>>>>>>>>>>>>>>>");
    //resetMap exits panorama view
    //show questions hide questions
    //nextStop is the question to be displayed
    this.setState({resetMap: true, showQuestions: false, nextStop: value});
  },

  //proceed to next stage
  proceedToNextLocation: function() {
    this.setState({nextStop: "", resetMap: true, showQuestions: false});
    if (this.state.current < this.state.challenges.length-1){
      var stage = this.state.current+1;
      if (stage == this.state.challenges.length-1)
          this.setState({finalStage: true});
      this.setState({current: stage});
    }
    else {
      //final challenge map
      this.setState({finalChallenge: true});
    }
  },

  //this is called when a marker is clicked
  renderQuestions: function() {
    this.setState({
          resetMap          : false,
          showQuestions     : true
        }); 
  },

  minusheart: function () {
    this.setState({hearts: this.state.hearts-1});
  },

  gameOver: function () {
    this.setState({restart: true});
  },

  render: function () {
    ///////TODO move to states
    //at least I got this correct
    //here I'm getting all the data at once!
    //var challenge = this.props.challenges[this.state.current];

    if(this.state.gameLoaded) {
        var challenge = this.state.challenges[this.state.current];
        var loc     = challenge.address;
        var lat     = challenge.latitude; 
        var lng     = challenge.longitude; 
        //questions
        var quiz      = challenge.questions;
        //riddle
        var riddle   = challenge.riddle.content;
        var hint     = challenge.riddle.hint;
        var solution = challenge.riddle.solution; 
        var finalStage = (this.state.challenges.length-1 === 0) ? true : this.state.finalStage;

    //TODO improve logic once data is retrieved from server
      var quizForm = <Quiz onComplete={this.proceedToNextLocation} 
                           questionDone={this.proceedToNextQuestion} 
                           showQuestions={this.state.showQuestions}
                           toggleInstruct={this.state.resetMap}
                           hearts={this.state.hearts}
                           minusheart={this.minusheart}
                           finalStage={finalStage}
                           gameOver={this.gameOver}
                           loc={loc} 
                           quiz ={quiz} 
                           clue={riddle} 
                           clueHint={hint} 
                           clueAns={solution}/>;

      var mapForm = <Map loc={loc} lat={lat} lng={lng} 
                         nextStop={this.state.nextStop}
                         renderQuestions={this.renderQuestions} 
                         resetMap={this.state.resetMap} />;
    }

    var arr=[];
    for (var i = 0; i< this.state.hearts; i++)
      arr.push('');

    //TODO heart instead of ruby
    var lives = arr.map(function (i) {
            return <img src="img/heart.png" height="35" width="35" /> });

    //here a giant if-else statement with showQuestions

    if (this.state.finalChallenge && this.props.include_final) { //after finish challenges
      return <Monster adventure_id={this.props.adventure_id} adventure_token={this.props.adventure_token} name={this.props.name} />;
    }
    else if (this.state.finalChallenge) {
      return <div> You are done </div>;
    }
    else if (this.state.restart) {
      return <PlayAdventure include_final={true} 
                            adventure_id={this.props.adventure_id}
                            adventure_token={this.props.adventure_token}
                            name={this.props.name} />
    }
    else if (this.state.gameLoaded) {  //renders along with answers
      //here slide question form infront of map or along with it
      return <div className="question-map-box">
                <div className="name-box">{this.props.name}</div>
                <div className="lives-box">{lives}</div>
                <div className="question-box">{quizForm}</div>
                <div >{mapForm}</div>
              </div>;
    } else {
      return <h1>Loading Game...</h1>;
    }
    
  } 
});
