$(document).ready(function() {

  //When you're using the prebuilt version from the CDN, the library is exported onto window.ReactRouter. 
  //So, Router is defined on window.ReactRouter
  //Route is defined on window.ReactRouter.Route.
  var Router = window.ReactRouter;
  var Route = Router.Route;
  var DefaultRoute = Router.DefaultRoute;
  var RouteHandler = Router.RouteHandler;
  var Link = Router.Link;
  
  var App = React.createClass({
    render: function () {
       return  <div>
                <Link to="/">Home</Link> | 
                <Link to="play">Play Adventure</Link> | 
                <Link to="create">Create Adventure</Link>
                <RouteHandler/>
              </div>;
    }
  });

  var routes = (  
    <Route handler={App}>
      <DefaultRoute handler={Home}/>
      <Route name="create" path="/create" handler={CreateAdventure}>
        <Route name="create_overview" path="/create/overview" handler={CreateOverview}/>
        <Route name="create_challenges" path="/create/challenges" handler={CreateChallenges}/>
        <Route name="create_final" path="/create/final" handler={CreateFinalComp}/>
      </Route>
      <Route name="play" path="/play" handler={Adventures} />
      <Route name="playadventure" path="/play/:id"       handler={PlayAdventure} />
      <Route name="finalpage"     path="/play/:id/final" handler={FinalPage} />
    </Route>
  );

  Router.run(routes, Router.HashLocation, function(Handler) {
    React.render(<Handler />, document.getElementById("adventure"));
  });

});
