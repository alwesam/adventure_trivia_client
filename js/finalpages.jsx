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
    var monster = <h1>You must choose, but choose wisely</h1>;

    var vim   = <img width="200" height="200" border="5" src="img/vim.png" onClick={this.gameWon}/>;
    var emacs = <img width="200" height="200" border="5" src="img/emacs.png" onClick={this.gameLost}/>;

    //Temp
    //var link = <h2><a href="#" onClick={this.gameWon}>OK you won</a></h2>;
    ////
    
    var finalPage = <FinalPage />;
    var finalPageLost = <FinalPageLost />;

    if (this.state.won)
      return <div>{finalPage}</div>;
    else if (this.state.loss)
      return <div>{finalPageLost}</div>;
    else
      return <div>
              {monster}
              <div className="container">
                <div className="row">
                  <div className="col-md-6">
                    {vim}
                  </div>
                  <div className="col-md-6">
                   {emacs}
                  </div>
                </div>
              </div>
             </div>; 
  }

});

var FinalPage = React.createClass({

  getInitialState: function () {
    return {rating: 0, ratingText: "Choose a rating"};
  },

  rate: function (value) {
    this.setState({rating: value});
    this.setState({ratingText: value+" stars"});
  },
  
  postReview: function(value) {
    //make a post request to post review 
  }, 

  render: function(){

    var image = <div><img src={'img/wisely.jpg'} /></div>;

    //TODO fix!!!!!!!!!!!!!1
    var stars = <span className="star-rating-next">
                   <input type="radio" name="rating" onChange={this.rate.bind(null,1)}/><i className={this.state.rating >= 1? "star-on":"star-off"}></i>
                   <input type="radio" name="rating" onChange={this.rate.bind(null,2)}/><i className={this.state.rating >= 2? "star-on":"star-off"}></i>
                   <input type="radio" name="rating" onChange={this.rate.bind(null,3)}/><i className={this.state.rating >= 3? "star-on":"star-off"}></i>
                   <input type="radio" name="rating" onChange={this.rate.bind(null,4)}/><i className={this.state.rating >= 4? "star-on":"star-off"}></i>
                   <input type="radio" name="rating" onChange={this.rate.bind(null,5)}/><i className={this.state.rating >= 5? "star-on":"star-off"}></i>
                 </span>;

    //TODO 
    var inviteFriends = <h4><a href="#">Invite your friends</a></h4>;
    var comments = <div> Comments </div>

    return <div>
            <h1>Congratulations!</h1>
            {image}
            <div>{stars}</div>
            <div><strong>{this.state.ratingText}</strong></div>
            {inviteFriends}
            {comments}
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
