var Marker = React.createClass({

  addMarker: function (place) {
      var lat = place.geometry.location.lat();  
      var lon = place.geometry.location.lng(); 

      //create a new marker object to be placed on map
      var marker = new google.maps.Marker({
        //I'm getting the map from GMap
              map: this.props.map,
              //position: new google.maps.LatLng(this.props.lat, this.props.lon),
              position: place.geometry.location,
              title: this.props.loc 
      });

      marker.infoBox = new google.maps.InfoWindow({
        content: "marker added successfully" 
      });

      //extend map as markers are added
      this.props.extendMap(this.props.bounds, lat, lon);

      google.maps.event.addListener(marker,'click',function() {          
        //bug: have to click twice to make disappear
        //TODO fix bug
          marker.setVisible(false);
          //marker.setClickable(false);
          this.gotoLocation(marker);
      }.bind(this)); 

      return marker;
  },

  decodeLoc: function () {
    //get the place
    var address = this.props.loc; 
    var service = new google.maps.places.PlacesService(this.props.map);        
    var request = {query: address};
    //make an async call to decode the address, after which a
    //callback functin is make to add the marker
    service.textSearch(request, function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            this.addMarker(results[0]);
        }
    }.bind(this)); 
  
  },
   
  //this function is called when location is clicked
  gotoLocation: function (marker) {
    //bug: have to click twice to make disappear
    //TODO fix bug
    //marker.setVisible(false);
    //marker.setClickable(false);
    //TODO hard code for now
    this.props.map.setZoom(15);
    this.props.map.panTo(marker.getPosition());

    //make max radius a state
    streetViewMaxDistance = 100;          
    //make point a state
    var point = marker.getPosition();
    var streetViewService = new google.maps.StreetViewService();
    //TODO make panorama a state or move to map
    //var panorama = this.props.map.getStreetView(); 
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
            strokeWeight: 10,
            map: that.props.map
          });
        };
      
        if (status === google.maps.StreetViewStatus.OK) {

          //TODO fix
          var oldPoint = point;
          point = streetViewPanoramaData.location.latLng;
          var _GREEN = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';

          var target = new google.maps.Marker({
              position: streetViewPanoramaData.location.latLng,
              map: this.props.map,
              title: streetViewPanoramaData.location.description,
              icon: _GREEN
          });
          
          drawLine(marker.getPosition(), target.getPosition());

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
              that.props.renderQuestions();
              //panorama.setVisible(false);
          });

        } else { 

          if (safety < 5) {
            safety += 1;
            console.log("trying: "+safety);
            streetViewMaxDistance = streetViewMaxDistance*2;

            streetViewService.getPanoramaByLocation(point, streetViewMaxDistance, getPanorama);
          } else {
            console.log("sorry")
          }
          
        }

    }.bind(this);

    streetViewService.getPanoramaByLocation(point, streetViewMaxDistance, getPanorama);
    
  },

    //TODO from here call the QUIZ 

  render: function () {

    //first step is to decode the location
    this.decodeLoc();
    //return null since not creating new html elements
    return null;
  }

}); 

var GMap = React.createClass({
 
  getInitialState: function () {
    return {map: null, mapBounds: null, panorama: null};
  },
   
  componentDidMount: function () {

    this.setState({map: this.createMap()}); 
    this.setState({mapBounds: this.setMapBounds()});
  
  },

  setMapBounds: function () {
    return new google.maps.LatLngBounds();
  },

  setPanoramView: function(bool) {
    this.state.panorama.setVisible(bool);
  },

  createMap: function () {
    
    var mapOptions = {
          //center: new google.maps.LatLng(41.9, 12.5),
          //zoom: 4
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

  resizeMap: function (bounds, lat, lon) {
    if(lat !== undefined && lon !== undefined)
	    bounds.extend(new google.maps.LatLng(lat, lon));

    var map = this.state.map;
	  map.fitBounds(bounds);
	  map.setCenter(bounds.getCenter());

    if (map.getZoom() > 8)
      map.setZoom(8);

    this.setState({map: map});
  },

  render: function () {
    
    //I'm having a list of markers and I'm passing them the lat and lon and the
    //map state
    
    var markers;
    if(this.state.map) {

      if (this.props.resetMap)
        this.setPanoramView(false);

      markers = <Marker loc={this.props.loc} 
                        renderQuestions = {this.props.renderQuestions}
                        map={this.state.map} 
                        panorama={this.state.panorama} 
                        resetMap={this.props.resetMap} 
                        extendMap={this.resizeMap} 
                        bounds={this.state.mapBounds} />;
    } else {
      markers = null;
    }

    //I'm just puting markers there in order to have render on the map
    var style = {height: "500px", width: "800px"};
    return <div style={style} ref="map_canvas">{markers}</div>;
  }

});
