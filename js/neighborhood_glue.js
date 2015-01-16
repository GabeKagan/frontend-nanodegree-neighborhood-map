/*Model requirements:

Name of location
GPS coords of location
Other stuff

#5: Gotta find out what we're searching for, first. 
#6: List of locations could probably be implemented by Knockout MVC logic. 
*/


var locationList = [];

//global test
var map = "";

//Constructs stuff that'll get put in locationList.
var neighborhoodLocation = function(name, lat, lng) {
    var self = this; //I assume this has to be done to hook things into Knockout.js
    self.name = name;
    self.lat = lat;
    self.lng = lng;
}

//Knockoutify this?
var addMarker = function(neighborhoodLocation) {

    this.name = neighborhoodLocation.name;
    this.lat = neighborhoodLocation.lat;
    this.lng = neighborhoodLocation.lng;
    
    var locationMarker = new google.maps.Marker({
        title: this.name,
        position: {lat: this.lat, lng: this.lng,},
    });
    locationMarker.setMap(map);
}


function initialize() {
    var mapOptions = {
        center: { lat: 42.5792, lng: -71.4383},
        zoom: 12
        };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    //Convert the marker code into its own function
    locationList[0] = new neighborhoodLocation("Ginger Tree", 42.627021, -71.415069);
    locationList[1] = new neighborhoodLocation("J. V. Fletcher Library", 42.5670675, -71.4476384);
    
    //Make a loop to populate the markers
    addMarker(locationList[0]);
    addMarker(locationList[1]);    

    }

//This is the controller?
function SearchViewModel() {
    this.searchPrompt = ko.observable("Test");
}


jQuery(function( $ ) {
    google.maps.event.addDomListener(window, 'load', initialize);
    ko.applyBindings(new SearchViewModel());
});