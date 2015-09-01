import React from 'react';  

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

      if(this.state.currentMarker != null) {
         //set previous marker to flag
         var _FLAG = new google.maps.MarkerImage(
              "img/flag.png",
              null, /* size is determined at runtime */
              null, /* origin is 0,0 */
              null, /* anchor is bottom center of the scaled image */
              new google.maps.Size(60, 60)
          );
         var m = this.state.currentMarker;
         m.setVisible(true);
         m.setClickable(false);
         m.setIcon(_FLAG);

        //remove all the gem markers from map
        for(var i = 0; i < this.state.gems.length; i++)
            this.state.gems[i].setMap(null);

        //empty array
        this.setState({gems: []});
  
      }

      this.setState({currentMarker: this.addMarker(null)});
      //establish a new bound
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

     google.maps.event.addListener(marker, 'mouseover', function(){
       marker.setAnimation(google.maps.Animation.BOUNCE);
     });

     //add event listner
     google.maps.event.addListener(marker,'click',function() {          
         marker.setVisible(false);
         this.gotoLocation(marker); //zoom into the location
     }.bind(this)); 

     return marker;

  },

  decodeTarget: function () { 
    
    var landmark = this.state.nextStop;// not being used for now 
    var service = new google.maps.places.PlacesService(this.props.map);        
    var request = {location: this.state.currentMarker.getPosition(), 
                   radius: 5000 //5 km 
                   }; 

    service.nearbySearch(request, function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          //console.log("this is how much results I'm getting "+results.length);
          var rand = Math.floor(Math.random()*results.length-1);
          if(this.state.selectRand === rand && rand < results.length-1)
              rand++;
          else if (this.state.selectRand === rand && rand > 0)
              rand--;
          this.setState({gem: this.addMarker(results[rand])});
          this.setState({selectRand: rand});
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
        
        var addGem = function(newLat, newLng, title) {
  
          //http://stackoverflow.com/questions/7842730/change-marker-size-in-google-maps-v3
          var _RUBY = new google.maps.MarkerImage(
              "img/ruby.png",
              null, /* size is determined at runtime */
              null, /* origin is 0,0 */
              null, /* anchor is bottom center of the scaled image */
              new google.maps.Size(40, 40)
          );

          var _INDY = new google.maps.MarkerImage(
              "img/indiana.jpg",
              null, /* size is determined at runtime */
              null, /* origin is 0,0 */
              null, /* anchor is bottom center of the scaled image */
              new google.maps.Size(50, 80)
          );

          var _STONE = new google.maps.MarkerImage(
              "img/stone.png",
              null, /* size is determined at runtime */
              null, /* origin is 0,0 */
              null, /* anchor is bottom center of the scaled image */
              new google.maps.Size(80, 80)
          );

          var gem = new google.maps.Marker({
              position: new google.maps.LatLng(newLat, newLng),
              map: that.props.map,
              title: title,
              icon: _RUBY
          });
        
          //TODO watch this
          that.setState({gems: that.state.gems.concat(gem)});

          google.maps.event.addListener(gem, 'click', function() {
              //here call the question
              that.props.renderQuestions();
              //set icon to something else and set to unclickable
              gem.setClickable(false);
              gem.setIcon(_STONE); //TODO
          });

        };
      
        if (status === google.maps.StreetViewStatus.OK) {

          var random = function () {
            return Math.floor(Math.random() * 0.0004)-0.0002; 
          };

          var oldPoint = point;
          point = streetViewPanoramaData.location.latLng;

          //TODO this is a hack for now
          var newLat = point.lat()+random();
          var newLng = point.lng()+random();

          addGem(newLat, newLng, streetViewPanoramaData.location.description);

          //drawLine(marker.getPosition(), gem.getPosition());
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


        } else { 

          if (safety < 5) {
            safety += 1;
            streetViewMaxDistance = streetViewMaxDistance*2;
            //try again
            streetViewService.getPanoramaByLocation(point, streetViewMaxDistance, getPanorama);
          } else {
            //console.log("Sorry, couldn't find panorama view within"+streetViewMaxDistance+"meters");
            addGem(point.lat(), point.lng(), "");
          }
          
        }

    }.bind(this);

    //start looking for a view
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
            mapWidth: window.innerWidth,
            mapHeight: window.innerHeight,
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
      //zoom: 12
    };

    //create map object 
    var map = new google.maps.Map(this.refs.map_canvas.getDOMNode(), mapOptions);

    //set panorama
    this.setState({panorama: map.getStreetView()});

    //another dirty hack
    google.maps.event.addDomListener(window, "resize", function() {

       this.setState({mapWidth: window.innerWidth});
       this.setState({mapHeight: window.innerHeight});
       
       var center = map.getCenter();
       google.maps.event.trigger(map, "resize");
       map.setCenter(center); 
     }.bind(this));

    /**
     * The following code to keep map centered when reizing window was taken from
     * the following stackoverflow link:
     * http://stackoverflow.com/questions/23947904/keep-google-maps-centered-when-window-resize
     */
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
      //console.log("extending locally");
      bounds = inbounds 
      //zoom_level = 15;
    }
    else{
      //console.log("extending globally");
      bounds = this.state.mapBounds;
      //zoom_level = 8;
    }

	  bounds.extend(new google.maps.LatLng(lat, lng));

	  map.fitBounds(bounds);
	  map.setCenter(bounds.getCenter());

    //TODO initial map zooming is not working properly
    if (map.getZoom() > 15)
      map.setZoom(15);

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

    var style = {height: this.state.mapHeight, width: this.state.mapWidth};
    return <div style={style} ref="map_canvas"> {markers} </div>;
  }

});

export default Map;
