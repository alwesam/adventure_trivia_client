var Router = window.ReactRouter;
var Link = Router.Link;

var Home = React.createClass({
  render: function () {
    var homePage = <div className="text-center homepage-box">
                       <h1>Welcome to Adventure Trivia</h1>
                       <img src="img/background.jpg" />
                       <h3><Link to="play">Play an Adventure</Link></h3>
                       <h3><Link to="create">Create an Adventure</Link></h3>
                   </div>;
     return  homePage;
  }
});
