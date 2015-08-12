var Monster = React.createClass({

  getInitialState: function () {
    return {won: false, loss: false, choose: false};
  },

  gameWon: function () {
    this.setState({won: true});
  },

  gameLost: function () {
    this.setState({loss: true});
  },

  choose: function () {
    this.setState({choose: true});
  },

  render: function(){
    var monster = <div className="text-center final-page">
                    <h2>You have braved many risks to get here and for this I salute you</h2>
                    <img src="img/knight.png"/>
                    <h2>However, before you get your hands on the treasure, you must pass the final challenge </h2>
                    <h2>You must choose, but choose wisely</h2>
                    <div className="accept-box">
                      <button onClick={this.choose}>Accept Challenge</button>
                    </div>
                  </div>;

    var android   = <img width="200" border="5" src="img/android.png" onClick={this.gameWon}/>;
    var iphone    = <img width="200" border="5" src="img/iphone.png"  onClick={this.gameLost}/>;
    
    var finalPage = <FinalPage adventure_id={this.props.adventure_id} adventure_token={this.props.adventure_token} name={this.props.name} won={this.state.won} />;

    if (this.state.won || this.state.loss)
      return <div>{finalPage}</div>;
    else if (this.state.choose)
      return <div className="text-center final-page">
              <h1> Choose Wisely </h1>
              <div className="finalpage-box">
                  <div className="col-md-6">
                    {android}
                  </div>
                  <div className="col-md-6">
                   {iphone}
                  </div>
               </div>
              </div>;
    else
      return monster;
  }

});

var FinalPage = React.createClass({

  getInitialState: function () {
      return {home: false, playAgain: false, audio: new Audio('music/indiana.wav'),
              rating: 0, ratingText: "Choose a rating"};
  },

  componentWillReceiveProps: function () {
  //TODO fix later
  //if (this.props.won)
  //    this.state.audio.play();
  },

  componentDidUpdate: function (prevState) {
    //do an ajax post request to send reviews
 
    if (prevState.rating != this.state.rating) { 

      var jsonData = {review: {rating: this.state.rating}};

      var url = "http://stark-ridge-5017.herokuapp.com/adventures/"+this.props.adventure_id+"/reviews";
      
      $.ajax({
        type: "POST",
        url: url,
        data: jsonData,
        success: function (data) {
          console.log("AJAX request POST result: "+data);
        }.bind(this)
      });

    }

  },

  rate: function (value) {
    this.setState({rating: value});
    this.setState({ratingText: value+" stars"});
  },
  
  postReview: function(value) {
    //make a post request to post review 
  }, 

  goHome: function () {
    this.setState({home: true});
  },

  playAgain: function () {
    this.setState({playAgain: true});
  },

  render: function(){

    var image_wisely = <div><img src={'img/wisely.jpg'} /></div>;
    var treasure = <div><img src={'img/treasure.png'} /></div>;

    var image_poorly = <div><img src={'img/poorly.jpg'} /></div>;
    var bones = <div><img src={'img/skeleton.jpg'} /></div>;

    //TODO fix!!!!!!!!!!!!!1
    var stars = <span className="star-rating">
                   <input type="radio" name="rating" onChange={this.rate.bind(null,1)}/><i className={this.state.rating >= 1? "star-on":"star-off"}></i>
                   <input type="radio" name="rating" onChange={this.rate.bind(null,2)}/><i className={this.state.rating >= 2? "star-on":"star-off"}></i>
                   <input type="radio" name="rating" onChange={this.rate.bind(null,3)}/><i className={this.state.rating >= 3? "star-on":"star-off"}></i>
                   <input type="radio" name="rating" onChange={this.rate.bind(null,4)}/><i className={this.state.rating >= 4? "star-on":"star-off"}></i>
                   <input type="radio" name="rating" onChange={this.rate.bind(null,5)}/><i className={this.state.rating >= 5? "star-on":"star-off"}></i>
                 </span>;

    //TODO 
    //var inviteFriends = <h4><a href="#">Invite your friends</a></h4>;
    var home = <h3><a href="#" onClick={this.goHome}> Home </a></h3>;
    var playAgain = <h3><a href="#" onClick={this.playAgain}> Play Again </a></h3>;

    if (this.state.home)
      return <HomePage />
    else if (this.state.playAgain) {
        return <PlayAdventure include_final={true} 
                              adventure_id={this.props.adventure_id} 
                              adventure_token={this.props.adventure_token} 
                              name={this.props.name} />
    }
    else if (this.props.won)
      return <div className="text-center closing-page">
            {image_wisely}
            {treasure}
            <div>{stars}</div>
            <div><strong>{this.state.ratingText}</strong></div>
            <div>{playAgain}</div>
            <div>{home}</div>
           </div>; 
    else
      return <div className="text-center closing-page game-lost">
             {image_poorly}
             {bones}
             <div>{playAgain}</div>
             <div>{home}</div>
           </div>; 
  }
});
