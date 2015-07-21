var Marker = React.createClass({

  getInitialState: function () {
    return {currentMarker: null, 
      gems: [], gem: null, 
      nextStop: null, 
      currentBounds: null,
      currentLoc: ""};
  },

  //for first time rendering
  componentDidMount: function () {
    this.setState({currentLoc: this.props.loc});
    //dirty hack to get the map bounds working
    this.props.extendMap(null, this.props.lat+0.01, this.props.lng+0.01);
  },

  componentWillReceiveProps: function (nextProps) {
 
    console.log("current loc>>>>>: "+this.props.loc);
    console.log("next loc>>>>>: "+nextProps.loc);
    console.log("current stop>>>>>: "+this.props.nextStop);
    console.log("next stop>>>>>: "+nextProps.nextStop);

    if (nextProps.loc != this.props.loc) {
      this.setState({currentLoc: nextProps.loc});
    }
  
    if (nextProps.nextStop != this.props.nextStop &&
        nextProps.nextStop.length >0 )
        this.setState({nextStop: nextProps.nextStop});
  },

  //once state with current location, place it on the map
  componentDidUpdate: function (prevProps, prevState) {
    if(prevState.currentLoc != this.state.currentLoc) {
      this.setState({currentMarker: this.addMarker(null)});
      //establish a new bound
      console.log("establishing a new bound at >>>>>>>>>>>>>>>>"+this.props.loc);
      this.setState({currentBounds: new google.maps.LatLngBounds(new google.maps.LatLng(this.props.lat, this.props.lng))});
    }
    else { 
      if(prevState.nextStop != this.state.nextStop)
        this.decodeTarget();
    }
  },

  addMarker: function (place) {

     if(place != null){
      var lat  = place.geometry.location.lat();  
      var lng  = place.geometry.location.lng(); 
      var name = place.formatted_address; 
      var bounds = this.state.currentBounds;
     }
     else {
      var lat  = this.props.lat;  
      var lng  = this.props.lng; 
      var name = this.props.loc; 
      var bounds = null; //starting fresh
     }

     //when we change locations, then we have a bouncing
     //marker that says click me
     //when we leave to the next location, the first marker
     //icon will be a flag (unclickable)
     var marker = new google.maps.Marker({
             map: this.props.map,
             position: new google.maps.LatLng(lat, lng),
             title: name 
     });

     marker.infoBox = new google.maps.InfoWindow({
       content: name 
     });

     //extend map as markers are added
     //TODO do in the map check!!!!!!!!
     this.props.extendMap(bounds, lat, lng);


     //add event listner
     google.maps.event.addListener(marker,'click',function() {          
         marker.setVisible(false);
         this.gotoLocation(marker); //zoom into the location
     }.bind(this)); 

     return marker;

  },

  decodeTarget: function () { 
    
    var landmark = this.state.nextStop; 
    console.log("landmark passed is: "+landmark);
    var service = new google.maps.places.PlacesService(this.props.map);        
    var request = {location: this.state.currentMarker.getPosition(), 
                   radius: 5000, //5 km 
                   types: ["night_club"]}; //TODO test for now

    service.nearbySearch(request, function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          this.setState({gem: this.addMarker(results[0])});
        }
    }.bind(this)); 
  },
   
  //this function is called when location is clicked
  gotoLocation: function (marker) {
    
    var point = marker.getPosition();
    //TODO hard code for now
    this.props.map.setZoom(15);
    this.props.map.panTo(marker.getPosition());

    //TODO make max radius a state
    var streetViewMaxDistance = 100;          
    //make point a state
    var streetViewService = new google.maps.StreetViewService();
    //setup a local variable
    var panorama = this.props.panorama;
    
    var safety = 0;
    
    var that = this;
    var getPanorama = function (streetViewPanoramaData, status) {

        //TODO fix and finish
        var drawLine = function(op,p) {
          //connect the two lines 
          var line = new google.maps.Polyline({
            path: [op, p],
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 5,
            map: that.props.map
          });
        };
      
        if (status === google.maps.StreetViewStatus.OK) {

          //TODO fix
          var oldPoint = point;
          point = streetViewPanoramaData.location.latLng;

          //TODO this is a hack for now
          var newLat = point.lat()+0.0002;
          var newLng = point.lng();

          var _GREEN = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
          var _INDIANA = 'img/indiana.jpg';

          //var _RUBY = 'img/ruby.jpg';
          //http://stackoverflow.com/questions/7842730/change-marker-size-in-google-maps-v3
          var _RUBY = new google.maps.MarkerImage(
              "img/ruby.png",
              null, /* size is determined at runtime */
              null, /* origin is 0,0 */
              null, /* anchor is bottom center of the scaled image */
              new google.maps.Size(30, 30)
          );

          var target = new google.maps.Marker({
              position: new google.maps.LatLng(newLat, newLng),
              //position: point,
              map: this.props.map,
              title: streetViewPanoramaData.location.description,
              icon: _RUBY
          });
          
          //drawLine(marker.getPosition(), target.getPosition());

          //from google maps api docs: Returns the heading from one LatLng to another LatLng.
          //Headings are expressed in degrees clockwise from North within the range [-180,180).
          //TODO bug with heading computation
          //var heading = google.maps.geometry.spherical.computeHeading(point, oldPoint);            
          panorama.setPano(streetViewPanoramaData.location.pano);
          panorama.setPosition(point);
          panorama.setPov({
              heading: 0,
              zoom: 1,
              pitch: 0
          });
          panorama.setVisible(true);

          google.maps.event.addListener(target, 'click', function() {
              //here call the question
              that.props.renderQuestions();
              //set icon to flag and set to unclickable
              target.setClickable(false);
              //panorama.setVisible(false);
          });

        } else { 

          if (safety < 5) {
            safety += 1;
            console.log("trying: "+safety);
            streetViewMaxDistance = streetViewMaxDistance*2;

            streetViewService.getPanoramaByLocation(point, streetViewMaxDistance, getPanorama);
          } else {
            //TODO doesn't work, investigate
            //this.setState({markerStatus: "Sorry, couldn't find panorama view within"+streetViewMaxDistance+"meters"});
            console.log("Sorry, couldn't find panorama view within"+streetViewMaxDistance+"meters");
          }
          
        }

    }.bind(this);

    streetViewService.getPanoramaByLocation(point, streetViewMaxDistance, getPanorama);
    
  },

  render: function () {
    //return null since not creating new html elements
    return null;
  }

}); 

var Map = React.createClass({
 
  getInitialState: function () {
    return {map: null, 
            mapBounds: null, 
            panorama: null};
  },
   
  componentDidMount: function () {
    this.setState({map: this.createMap()}); 
    this.setState({mapBounds: this.setMapBounds()});
  
  },

  setMapBounds: function () {
    //the main map bounds
    return new google.maps.LatLngBounds();
  },

  setPanoramaView: function(bool) {
    this.state.panorama.setVisible(bool);
  },

  createMap: function () {
    
    var mapOptions = {
          zoom: 12
    };

    //create map object 
    var map = new google.maps.Map(this.refs.map_canvas.getDOMNode(), mapOptions);

    //set panorama
    this.setState({panorama: map.getStreetView()});

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

  resizeMap: function (inbounds, lat, lng) {

    var map = this.state.map;
    var bounds;

    if (inbounds != null){
      console.log("extending locally");
      console.log(inbounds);
      bounds = inbounds 
    }
    else{
      console.log("extending globally");
      bounds = this.state.mapBounds;
    }

	  bounds.extend(new google.maps.LatLng(lat, lng));

	  map.fitBounds(bounds);
	  map.setCenter(bounds.getCenter());

    //TODO initial map zooming is not working properly
    if (map.getZoom() > 15)
      map.setZoom(15);

    console.log("zooooooooooooooming");
    console.log("zoom level "+map.getZoom());

    if(inbounds == null)
      this.setState({map: map, mapBounds: bounds});
  },

  toggleStreetView: function () {
    var toggle = this.state.panorama.getVisible();
    if (toggle == true)
      this.state.panorama.setVisible(false); 
    else
      this.state.panorama.setVisible(true);  
  },

  resetView: function () {
    this.state.panorama.setVisible(false);
  },

  render: function () {
    
    //I'm having a list of markers and I'm passing them the lat and lon and the
    //map state
    if(this.props.resetMap)
       this.resetView();
    
    var markers;

    if(this.state.map) {
      markers = <Marker loc={this.props.loc} lat={this.props.lat} lng={this.props.lng}
                        renderQuestions = {this.props.renderQuestions}
                        nextStop = {this.props.nextStop}
                        map={this.state.map} 
                        sendMarkers={this.sendMarkers}
                        panorama={this.state.panorama} 
                        extendMap={this.resizeMap} 
                        />;
    } else {
      markers = null;
    }

    //I'm just puting markers there in order to have render on the map
    //TODO fix style to make it responsive
    var style = {height: "500px", width: "1000px"};
    //var button = <div id="panel" >
    //                <input type="button" value="Toggle Street View" onClick={this.toggleStreetView}/>
    //             </div>;

    return <div style={style} ref="map_canvas"> {markers} </div>;
  }

});
