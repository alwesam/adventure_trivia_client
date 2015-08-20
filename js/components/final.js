import React from 'react';  
import Router from 'react-router';  
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';

var Monster = React.createClass({

  getInitialState: function () {
    return {choose: false};
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

    var android   = <Link to="finalpage" params={{id: this.props.id}} query={{won: "true"}} ><img width="200" border="5" src="img/android.png" /></Link>;
    var iphone    = <Link to="finalpage" params={{id: this.props.id}} query={{won: "false"}}><img width="200" border="5" src="img/iphone.png"  /></Link>;
    
    if (this.state.choose)
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
      return {rating: 0, ratingText: "Choose a rating"};
  },

  componentDidUpdate: function (prevState) {
    //do an ajax post request to send reviews
    if (prevState.rating != this.state.rating) { 
      var jsonData = {review: {rating: this.state.rating}};
      var url = "http://localhost:3000/adventures/"+this.props.params.id+"/reviews";
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
    this.setState({rating: value, ratingText: value+" stars"});
  },
  
  postReview: function(value) {
    //make a post request to post review 
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
    //var inviteFriends = <h4><Link><a href="#">Invite your friends</a></Link></h4>;
    var home = <h3><Link to="/"> Home </Link></h3>;
    var playAgain = <h3><Link to="/play"> Play Again </Link></h3>;

    if (this.props.query.won === "true")
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
