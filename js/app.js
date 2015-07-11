/**
 * Authored by Wesam Al-Haddad
 * July 2015
 * this project uses google maps js api (v3), react, html/css,
 * jquery, and possibly webgl and 3js for front end
 * rails at backend
 */

var map;
var stage;
//var panorama;
var _ZOOM_CLOSE = 17;

//TODO this info will come from the server
//this is a placeholder
var adventure = {
  name: "Find Holy Grail",
  challenges: [
        {
          loc: "Rome, Italy",
          questions: [
                      {"What is the capital of Spain?": 
                        [{"Madrid": true}, 
                        {"London": false}, 
                        {"Istanbul": false}]
                      }, 
                      {"What is the capital of Austria?": 
                        [{"Madrid": false}, 
                        {"Vienna": true}, 
                        {"Berlin": false}]
                      }, 
                      {"What is the capital of Poland?": 
                        [{"Madrid": false}, 
                        {"Vienna": false}, 
                        {"Warsaw": true}]
                      } 
          ],
          clue: {"content" : "closest metropolis to the pyramids", "answer" : "cairo"},
          statusComplete: false
        }, 
        {
          loc: "Giza Necropolis, Giza, Egypt",
          questions: [
                      {"What is the capital of Spain?": 
                        [{"Madrid": true}, 
                        {"London": false}, 
                        {"Istanbul": false}]
                      }, 
                      {"What is the capital of Austria?": 
                        [{"Madrid": false}, 
                        {"Vienna": true}, 
                        {"Berlin": false}]
                      }, 
                      {"What is the capital of Poland?": 
                        [{"Madrid": false}, 
                        {"Vienna": false}, 
                        {"Warsaw": true}]
                      } 
          ],
          clue: {"content" : "closest metropolis to the pyramids", "answer" : "cairo"},
          statusComplete: false
        }, 
        {
          loc: "Petra, Kingdom of Jordan",
          questions: [
                      {"What is the capital of Spain?": 
                        [{"Madrid": true}, 
                        {"London": false}, 
                        {"Istanbul": false}]
                      }, 
                      {"What is the capital of Austria?": 
                        [{"Madrid": false}, 
                        {"Vienna": true}, 
                        {"Berlin": false}]
                      }, 
                      {"What is the capital of Poland?": 
                        [{"Madrid": false}, 
                        {"Vienna": false}, 
                        {"Warsaw": true}]
                      } 
          ],
          clue: {"content" : "You lost", "answer" : "Just kidding"},
          statusComplete: false
        } 
  ],
  finalChallenge: "Game"
}; 
////

//TODO create a marker prototype to manipulate markers and customize them in terms of
//shape, size and what not
//data here is adventure.challenges
var markerObj = function (data) {    

    var self = this;
    self.address = data.loc;
    //TODO ask why it's not passing
    //self.questions = data.questions;

    var locStr = data.loc;
    var questionsArr = data.questions;
    var clueObj = data.clue;
    
    var placeMarker = function (place) {
      var lat = place.geometry.location.lat();  
      var lon = place.geometry.location.lng(); 
      //TODO do a custom marker
      var marker = new google.maps.Marker({
              map: map,
              position: place.geometry.location,
              title: locStr 
      });
      
      marker.infoBox = new google.maps.InfoWindow({
        content: locStr 
      });

      //TODO a little hack
      marker.loc = marker.infoBox.content;
      marker.questions = questionsArr; 
      marker.clue = clueObj; 
      
      //here call the places
      google.maps.event.addListener(marker,'click',function() {          
          marker.setVisible(false);
          gotoLocation(marker);
      }); 

      resizeMap(window.mapBounds, lat,lon);
      return marker;

    };

    var service = new google.maps.places.PlacesService(map);        
    var request = {query: self.address};
    service.textSearch(request, function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            self.markerObj = placeMarker(results[0]);
        }
    }); 

};

var gotoLocation = function (marker) {

    self = this;
    map.setZoom(_ZOOM_CLOSE);
    map.panTo(marker.getPosition());

    //could be redundanct for now
    var questions = marker.questions;
    var clue = marker.clue;
    
    streetViewMaxDistance = 100;          
    var point = marker.getPosition();
    var streetViewService = new google.maps.StreetViewService();
    var panorama = map.getStreetView(); 
    
    var safety = 0;
    
    //callback function
    var getPanorama = function (streetViewPanoramaData, status) {
        var that = this;

        var drawLine = function(op,p) {
          //connect the two lines 
          var line = new google.maps.Polyline({
            path: [op, p],
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 10,
            map: map
          });
        };

        //succesfully found a spot
        if(status === google.maps.StreetViewStatus.OK){

          var oldPoint = point;
          console.log("old point: "+oldPoint);
          //find the closest point with panorama shot
          point = streetViewPanoramaData.location.latLng;
          console.log("new point: "+point);

          //another marker
          var _STAR = 'https://maps.google.com/mapfiles/kml/shapes/star.png';
          var _GREEN = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';

          var marker = new google.maps.Marker({
              position: streetViewPanoramaData.location.latLng,
              map: map,
              title: streetViewPanoramaData.location.description,
              icon: _GREEN
          });

          /***
           * Add logic to add random objects in proximity for users to select
           ***/
          //TODO this is a hack for now
          //new google.maps.LatLng(47.651968, 9.478485),
          var newLat = marker.getPosition().lat()+0.0005;
          var newLng = marker.getPosition().lng();

          var target = new google.maps.Marker({
              position: new google.maps.LatLng(newLat, newLng),
              map: map,
              title: streetViewPanoramaData.location.description,
              icon: _STAR
          });

          drawLine(marker.getPosition(), target.getPosition());

          //from google maps api docs: Returns the heading from one LatLng to another LatLng.
          //Headings are expressed in degrees clockwise from North within the range [-180,180).
          var heading = google.maps.geometry.spherical.computeHeading(point, oldPoint);            
    
          panorama.setPano(streetViewPanoramaData.location.pano);
          panorama.setPosition(point);
          panorama.setPov({
              heading: heading,
              zoom: 1,
              pitch: 0
          });
          panorama.setVisible(true);

          google.maps.event.addListener(target, 'click', function() {

            var feedback = answerQuestions(questions);
            //TODO add reactx
           
            if (feedback) {
              panorama.setVisible(false);
              //TODO fix not working now
              //stage += 1;
              //startAdventure(stage);
            }

          });

          $('#toggleView').click(function(){
               var toggle = panorama.getVisible();
               if (toggle == false) {
                  panorama.setVisible(true);
               } else {
                  panorama.setVisible(false);
              }
          });

        }else{
          // no street view available in this range, or some error occurred
          //update point
          if (safety < 5) {
            safety += 1;
            console.log("trying: "+safety);
            //var oldPoint = point;
            //point = streetViewPanoramaData.location.latLng;
            //drawLine(oldPoint, point);
            streetViewMaxDistance = streetViewMaxDistance*2;
            streetViewService.getPanoramaByLocation(point, streetViewMaxDistance, getPanorama);
          } else {console.log("sorry")}
          
        }

    };

    streetViewService.getPanoramaByLocation(point, streetViewMaxDistance, getPanorama);

};

var answerQuestions = function (questions) {

  //console.log('go somewhere else');
  for (var i = 0; i < questions.length; i++)
    console.log(Object.keys(questions[i]));

  return true;

};

var startAdventure = function (stage) {

  for (var i = 0; i <adventure.challenges.length; i++)
    markerObj(adventure.challenges[i]);

  //TODO fix later
 /* 
  if (stage < adventure.challenges.length)
    markerObj(adventure.challenges[stage]);
  else
    console.log("adventure complete");
  */

};

var resizeMap = function (bounds, lat, lon) {
  if(lat !== undefined && lon !== undefined)
	  bounds.extend(new google.maps.LatLng(lat, lon));
	map.fitBounds(bounds);
	map.setCenter(bounds.getCenter());
  if (map.getZoom() > _ZOOM_CLOSE)
    map.setZoom(_ZOOM_CLOSE);
};

var requestInfo = function () {

    /*set a timeout of 8 seconds for the AJAX request to complete
     * request
     */
    var requestTimeout = setTimeout(function () {
      consol.log('Failed to fetch information');
    }, 8000);

    /* Send an AJAX request to Wikipedia*/
    //TODO complete
    $.ajax({
       url: railsURL, 
       /*jsonp datatype is specified to be able to pass functions in JSON
        * request*/
       dataType: "json",
       success: function(adventure) {
              //startAdventure();
             clearTimeout(requestTimeout); 
        }        
    });

};

var initializeMap = function () {
    var canvas = $('#map-canvas');
    map = new google.maps.Map(canvas[0]);
    window.mapBounds = new google.maps.LatLngBounds();

    //begin with the first adventure
    //do an ajax request here to retrieve information 
    //requestInfo()
    stage = 0;
    startAdventure(stage);

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

};

$(document).ready(function() {
  var link = 'http://maps.googleapis.com/maps/api/js?libraries=places&callback=initializeMap';
  $('body').append("<script src="+link+"></script>");
}); 
