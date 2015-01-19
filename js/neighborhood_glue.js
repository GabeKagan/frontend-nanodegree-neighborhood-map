/*Model requirements:

Name of location
GPS coords of location
Other stuff

#5: Gotta find out what we're searching for, first. 
#6: List of locations could probably be implemented by Knockout MVC logic. 
*/


var locationList = [];

var map = "";

//Constructs stuff that'll get put in locationList.
//If we get this from Google Maps API requests, that might help out a bit.
var neighborhoodLocation = function(name, lat, lng, contentString) {
    var self = this; //I assume this has to be done to hook things into Knockout.js
    self.name = name;
    self.lat = lat;
    self.lng = lng;
    self.contentString = contentString;
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

    var infowindow = new google.maps.InfoWindow({
        content: neighborhoodLocation.contentString,
    });
    google.maps.event.addListener(locationMarker, 'click', function() {
        infowindow.open(map, locationMarker);
    });
}


function initialize() {
    var mapOptions = {
        center: { lat: 42.5792, lng: -71.4383},
        zoom: 12
        };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    //Make a function that assembles new locations based on some sort of API request.
    locationList[0] = new neighborhoodLocation("Ginger Tree", 42.627021, -71.415069, "Blah blah food");
    locationList[1] = new neighborhoodLocation("J. V. Fletcher Library", 42.5670675, -71.4476384, "Hurp durp books");
    console.log(locationList);
    //Add more things to the markers. 
    for(var i=0;i<locationList.length;++i)
    {
        addMarker(locationList[i]);
    }   

}

//This is the controller?
function SearchViewModel() {
    var self = this;
    this.test = ko.observable("Use this controller function to grab all the data from the array locationList");
    this.test2 = ko.observable("Then use HTML/JS to print it out here.");
    this.searchPrompt = ko.observable("Test");
}


jQuery(function( $ ) {
    google.maps.event.addDomListener(window, 'load', initialize);
    ko.applyBindings(new SearchViewModel());
});