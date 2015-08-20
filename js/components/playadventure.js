import React from 'react';  
import Router from 'react-router';  
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';

import Quiz from './quiz.js';
import Map from './gmap.js';
import Monster from './choose.js';

//start the adventure, this will be a new page
var PlayAdventure = React.createClass({

  getInitialState: function() {
    return { current: 0, 
             challengeID: 0,
             showQuestions: false, 
             gameLoaded: false,
             nextStop: "",
             hearts: 3,
             resetMap: false, 
             finalStage: false,
             finalChallenge: false }
  },

  componentDidMount: function () {
    var id = this.props.params.id;
    var token = this.props.query.token;
    $.ajax({
      url: "http://localhost:3000/adventures/"+id+"?token="+token,
      method: "GET",
      success: function(data){
        this.setState({
          challenges: data.challenges,
          gameLoaded: true
        }); 
      }.bind(this)
    });

  },

  proceedToNextQuestion: function (value) {
    this.setState({resetMap: true, showQuestions: false, nextStop: value});
  },

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

  render: function () {

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
    
      } else {var quizForm=""; mapForm="";}

    var arr=[];
    for (var i = 0; i< this.state.hearts; i++)
      arr.push('');

    var lives = arr.map(function (i) {
            return <img src="img/heart.png" height="35" width="35" /> });

    var spinnerDisplay = this.state.gameLoaded ? "none" : "block";
    var spinnerStyle   = {display: spinnerDisplay};

    if (this.state.finalChallenge) { //after finish challenges
      return <Monster id={this.props.params.id}/>;
    }
    else {  
      //here slide question form infront of map or along with it
      return <div className="question-map-box">
                <div style={spinnerStyle} className="text-center">
                  <h2>Loading...</h2>
                </div>
                <div className="name-box">{this.props.query.name}</div>
                <div className="lives-box">{lives}</div>
                <div className="question-box">{quizForm}</div>
                <div>{mapForm}</div>
              </div>;
    }
    
  } 
});

export default PlayAdventure;
