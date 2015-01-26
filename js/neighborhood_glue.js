/*
Possible function for later: Perform "traveling salesman" algorithm on user selected locations to find
the shortest route between all of them.
*/


var map = "";
var searchPrompt = "";

//Constructs stuff that'll get put in locationList.
//If we get this from Google Maps API requests, that might help out a bit.
var neighborhoodLocation = function(name, lat, lng, contentString) {
    var self = this; //I assume this has to be done to hook things into Knockout.js
    self.name = name;
    self.lat = lat;
    self.lng = lng;
    self.contentString = contentString;

    //Now for variables derived from the initial ones, and from other sources.
    self.locationMarker = new google.maps.Marker({
        title: this.name,
        position: {lat: this.lat, lng: this.lng,},
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    });
    self.infoWindow = new google.maps.InfoWindow({
        content: neighborhoodLocation.contentString,
    });
}

//Create a function that converts Google Maps API data into these?
var locationList = [
    new neighborhoodLocation("Ginger Tree", 42.627021, -71.415069, "Blah blah food"),
    new neighborhoodLocation("J. V. Fletcher Library", 42.5670675, -71.4476384, "Hurp durp books"),
    new neighborhoodLocation("Henry Fletcher House",42.551111,-71.4275,"Frankly, I don't know anything about this place."),
    new neighborhoodLocation("Westford Academy",42.577503,-71.463874,"I suppose this isn't terribly interesting."),
    new neighborhoodLocation("Flushing Pond Road", 42.6231856,-71.438461,"Heh."),
];

//Knockoutify this? More importantly, make this a method of neighborhoodLocation?
var addMarker = function(neighborhoodLocation) {

    this.name = neighborhoodLocation.name;
    this.lat = neighborhoodLocation.lat;
    this.lng = neighborhoodLocation.lng;
    this.locationMarker = neighborhoodLocation.locationMarker;
    this.infoWindow = neighborhoodLocation.infoWindow;
    
    locationMarker.setMap(map);

    //These are not working. They display a malformed InfoWindow in an incorrect location.
    google.maps.event.addListener(locationMarker, 'click', function() {
        infoWindow.open(map, locationMarker);
    });
}


function initialize() {
    var mapOptions = {
        center: { lat: 42.5792, lng: -71.4383},
        zoom: 12
        };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    //Turn this into a Knockout observable array, and use a push function to add further stuff?
    //Add more things to the markers.
    //Displays the markers and populates the HTML list. 
    for(var i=0;i<locationList.length;++i)
    {
        addMarker(locationList[i]);
    }
    for(var i=0;i<locationList.length;++i)
    {
        SearchViewModel.HTMLLocs.push(locationList[i].name);
    }

}

//This might need to be merged into a "controller" with showCorrespondingMarker below.
//Implementation cribbed from http://opensoul.org/2011/06/23/live-search-with-knockoutjs/
var SearchViewModel = {
    searchPrompt: ko.observable(""),
    HTMLLocs: ko.observableArray(),
    //The way the applet is built now, you don't add new locations.
    search: function(value){
        console.log(value);
        //Only attempt the "live" search if there's some text in the field.
        if(value != "") {
            for(var x in locationList)
            {
                //The actual search here. If we find anything, print it to the page.
                if(locationList[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0){
                    
                }
            }
        }
    },
}

function showCorrespondingMarker() {
    //First, reset the marker coloration.
    for(var x in locationList)
    {
        locationList[x].locationMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
    }

    //This returns a DOM element, but rewrite it to use KnockoutJS's methods.
    var optionMarker = document.getElementById("locationOptions").value;
    //Get the corresponding index in our list of Google locations, using some prototype.map trickery.
    //Won't work in legacy browsers like IE8.
    var selectedMarker = locationList.map(function(e) { return e.name}).indexOf(optionMarker);

    /* Centers the camera and turns the corresponding marker blue (Initially green, but colorblind people would complain).
    Got some info from http://stackoverflow.com/questions/2818984/google-map-api-v3-center-zoom-on-displayed-markers; it might be irrelevant now.
    */
    if(selectedMarker != -1) {
        locationList[selectedMarker].locationMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
        map.setCenter({lat:locationList[selectedMarker].lat, lng:locationList[selectedMarker].lng});
    }
}


jQuery(function( $ ) {
    google.maps.event.addDomListener(window, 'load', initialize);
    ko.applyBindings(SearchViewModel);
    SearchViewModel.searchPrompt.subscribe(SearchViewModel.search);
});