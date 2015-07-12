var Marker = React.createClass({

  addMarker: function () {

      //console.log("decode this location: "+this.props.loc);
      console.log("I'm marking");

      var marker = new google.maps.Marker({
        //I'm getting the map from GMap
              map: this.props.map,
              position: new google.maps.LatLng(this.props.lat, this.props.lon),
              title: this.props.title 
      });

      //extend map as markers are added
      //this.props.extendMap(this.props.lat, this.props.lon);

      console.log("This is the marker: "+marker);

      google.maps.event.addListener(marker,'click',function() {          
          marker.setVisible(false);
          this.gotoLocation();
      }.bind(this)); 

      return marker;
  },
   
  //this function is called when location is clicked
  gotoLocation: function () {
    console.log("marker clicked");
    //streetViewService.getPanoramaByLocation(point, streetViewMaxDistance, getPanorama);
  },

  getPanorama: function () {
    //TODO from here call the QUIZ 
  },

  render: function () {
    console.log("Marker here");
    this.addMarker();
    return null;
  }

}); 

var GMap = React.createClass({
 
  getInitialState: function () {
    console.log("initialstate");
    return {map: null};
  },
   
  componentDidMount: function () {

    this.setState({map: this.createMap()}); 
    //make a request to geocode places
    //this.setState({marker: this.addMarker()}); 
  
  },

  mapClick: function () {
    console.log("map clicked"); 
  },

  createMap: function () {
    console.log("creating map");
    var mapOptions = {
          center: new google.maps.LatLng(-34.397, 150.644),
          zoom: 8
        };

    //resize map as window grow
    var map = new google.maps.Map(this.refs.map_canvas.getDOMNode(), mapOptions);

    google.maps.event.addListener(map, 'click', this.mapClick);

    /**
     * The following code to keep map centered when reizing window was taken from
     * the following stackoverflow link:
     * http://stackoverflow.com/questions/23947904/keep-google-maps-centered-when-window-resize
     */
    //TODO review this code
    google.maps.event.addListener(map, 'center_changed', function() {
	    var size = [this.getDiv().offsetWidth,this.getDiv().offsetHeight].join('x');
	    if( !this.get('size') || size === this.get('size')){
	       this.setValues({size:size,_center:this.getCenter()});         
	    }
	    else{
	      google.maps.event.addListenerOnce(this,'idle',function(){
	      this.setValues({size:size,center:this.get('_center')});});      
	    }
    });
    google.maps.event.trigger(map,'center_changed',{});

    return map; 
  
  },

  addMarker: function () {

      //console.log("decode this location: "+this.props.loc);
      console.log("I'm marking");

      var marker = new google.maps.Marker({
        //I'm getting the map from GMap
              map: this.state.map,
              position: new google.maps.LatLng(-34.397, 150.644),
              title: "test" 
      });

      //this.props.extendMap(this.props.lat, this.props.lon);

      google.maps.event.addListener(marker,'click',function() {          
          //marker.setVisible(false);
          this.gotoLocation();
      }.bind(this)); 

      return marker;
  },
   
  //this function is called when location is clicked
  gotoLocation: function () {
    console.log("marker clicked");
    //streetViewService.getPanoramaByLocation(point, streetViewMaxDistance, getPanorama);
  },

  getPanorama: function () {
    //TODO from here call the QUIZ 
  },

  resizeMap: function () {
     //TODO 
     console.log("extending map");
  },

  getMap: function () {
    return this.set.map;
  },

  render: function () {
    console.log("rendering map");
    console.log("Map is: " +this.state.map);
    
    //I'm having a list of markers and I'm passing them the lat and lon and the
    //map state
    
    var markers;
    if(this.state.map) {
      markers = this.props.markers.map(function(e){
                    return <Marker map={this.state.map} title={e.title} lat={e.lat} lon={e.lon} /> }.bind(this));
    } else {
      markers = null;
    }

    //I'm just puting markers there in order to have render on the map
    var style = {height: "500px", width: "500px"};
    return <div style={style} ref="map_canvas">{markers}</div>;
  }

});
