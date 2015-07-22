//Note this will be part of the index page
var Adventure = React.createClass({

  getInitialState: function () {
    return {description: "",
            detailsFetched: false}
  },

  fetchDetails: function () {
      this.setState({
        detailsFetched: true
      }); 
  },

  //TODO review code
  startAdventure: function () {
    this.props.start(this.props.name, this.props.id);
  },

  hideAdventure: function () {
    this.setState({detailsFetched: false});
  },

  render: function () {

    var arr=[];
    for (var i = 0; i< parseInt(this.props.rating); i++)
      arr.push('');

    //TODO star instead of ruby
    if(this.props.rating > 0)
      var stars = arr.map(function (i) {
              return <img src="img/ruby.png" height="30" width="30" /> });
    else
      var stars = <h4>Not Rated</h4>

    if (this.state.detailsFetched) {
      return <div className="row adventure-item-details">
                <div className="col-md-6">
                  <h3>{this.props.name}</h3>
                  <div>{stars}</div>
                </div>
                <div className="col-md-6">
                  <h4>{this.props.description}</h4>
                  <button className="btn btn-primary" href="#" onClick={this.startAdventure}>Play</button>
                  <button className="btn btn-primary" href="#" onClick={this.hideAdventure} >Hide</button>
                </div>
              </div>;
    }
    else {
      return <div className="adventure-item">
               <h3><a href="#!" onClick={this.fetchDetails}> {this.props.name}</a></h3>
             </div>;
    }
  }

});

var Adventures = React.createClass({
  getInitialState: function () {
    return {adventures: [], 
            passed_up_id: null, //not ideal, this 
            startAdventure: false,
            title: "",
            showSpinner: true}
  },

  componentDidMount: function () {
    
    //for now just do the following
    //var data = [{"name": "Find the Holy Grail", "description": "Indy!!!"}];
    var url = "http://localhost:3000/adventures";
    $.ajax({
      type: "GET",
      url: url,
      success: function (data) {
        this.setState({adventures: data});
        this.setState({showSpinner: false});
      }.bind(this)
    });
  },

  //TODO, review this code looks a bit prolematic
  start: function (title, id) {
     this.setState({startAdventure: true, title: title,
                    passed_up_id: id }); 
  },

  render: function () {
    
    var adventures = this.state.adventures.map(function(a) {
          return <Adventure name={a.title} 
                            id={a.id} 
                            description={a.description} 
                            rating={a.average_rating} 
                            start={this.start} />; 
    }.bind(this));

    var spinnerDisplay = this.state.showSpinner ? "block" : "none";
    var spinnerStyle   = {display: spinnerDisplay};
    
    if (this.state.startAdventure) {
      return <PlayAdventure include_final={true}
                            adventure_id={this.state.passed_up_id}
                            name= {this.state.title} 
                             />;
    }
    else { //render a list
      return <div>
               <div style={spinnerStyle} className="text-center">
                 <h2>Loading...</h2>
               </div>
               <div className="adventures-list">
                <h2>Choose Your Adventure</h2>
                {adventures}
               </div>
             </div>;
    }
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

    var homePage = <div className="text-center homepage-box">
                       <h1>Welcome to Adventure Trivia</h1>
                    <div className="homepage-actions">
                       <h3><a href="#" onClick={this.create}>Create an Adventure</a></h3>
                       <h3><a href="#" onClick={this.play}>Play an Adventure</a></h3>
                    </div>
                   </div>;

    if (this.state.createAdventure)
      //define styling for all inputs, textareas and buttons
      return <div className="container-fluid"> <CreateAdventure /></div>;
    else if (this.state.playAdventure)
      return <div> <Adventures /> </div>;
    else
      return homePage;

  }
});

var initialize = function () {
  //for now
  React.render(<HomePage />, document.getElementById("adventure"));
}

$(document).ready(function() {
  var link = 'http://maps.googleapis.com/maps/api/js?libraries=places&callback=initialize';
  $('body').append("<script src="+link+"></script>");
}); 
