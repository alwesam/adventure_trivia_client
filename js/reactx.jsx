//Note this will be part of the index page
var Adventure = React.createClass({

  getInitialState: function () {
    return {description: "",
            play       : false,
            challenges      : [],
            detailsFetched: false}
  },

  //TODO don't fetch the whole thing at once
  fetchDetails: function () {
    $.ajax({
      url: "http://localhost:3000/adventures/"+this.props.id+".json",
      method: "GET",
      success: function(data){
        console.log("here are the details of adventure >>>>>>>>>>>>>>>>>");
        console.log(data);
        this.setState({
          description: data.description,
          challenges: data.challenges,
          detailsFetched: true
        }); 
        console.log(this.state.challenges);
      }.bind(this)
    });
  },

  startAdventure: function () {
    this.setState({play: true});
  },

  render: function () {
    if (this.state.play) {
      //TODO need to flush the whole DOM and start again with a new page
      return <PlayAdventure include_final={true} name= {this.props.name} challenges={this.state.challenges} />
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
              <h3><a href="#" onClick={this.fetchDetails}> {this.props.name}</a></h3>
             </div>;
    }
  }

});

var Adventures = React.createClass({
  getInitialState: function () {
    return {adventures: [], 
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

  render: function () {
    
    var adventures = this.state.adventures.map(function(a) {
      return <Adventure name={a.title} id={a.id} />; 
    });
    var spinnerDisplay = this.state.showSpinner ? "block" : "none";
    var spinnerStyle   = {display: spinnerDisplay};
    //TODO Problem here
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
  React.render(<HomePage />, document.getElementById("adventure"));
  //React.render(<FinalPage />, document.getElementById("adventure"));
}

$(document).ready(function() {
  var link = 'http://maps.googleapis.com/maps/api/js?libraries=places&callback=initialize';
  $('body').append("<script src="+link+"></script>");
}); 
