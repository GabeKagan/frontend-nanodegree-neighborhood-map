/*
Possible function for later: Perform "traveling salesman" algorithm on user selected locations to find
the shortest route between all of them.
APIs to implement:
Some sort of weather API (like Weather Channel/Underground, but that has fairly low usage caps)
A travel API?
News from locations
*/

//Globals. We need a bunch of these.
var map;
var searchPrompt = "";
var contentWindow = new google.maps.InfoWindow({
    content: "Debug",
});
var redditHTML, wikiHTML, photoURL, photoList, pictureService, placeDetails, highlightedLocation, selectedMarker, iconColor;


//Takes an item from locationList and preps it for display by running some API calls.
//If we get this from Google Maps API requests, that might help out a bit.
var neighborhoodLocation = function(name, lat, lng, contentString) {
    var self = this; //I assume this has to be done to hook things into Knockout.js
    self.name = name;
    self.lat = lat;
    self.lng = lng;

    //Placeholder. Later, if we don't have a coordinate, try to get something from geocoding.
    if(lat = undefined) { lat = 0;}
    if(lng = undefined) { lng = 0;}


    //The initial comment string is a personal comment on the area.
    //Expand content string to include API pulls, HTML, etc. and such.
    self.contentString =  contentString;

    //Now for variables derived from the initial ones, and from other sources.
    self.locationMarker = new google.maps.Marker({
        title: this.name,
        position: {lat: this.lat, lng: this.lng,},
        icon: "images/red-dot.png",
    });

}


//Create a function that converts Google Maps API data into these?
//Maybe I should move this to a new file.
var locationList = ko.observableArray([
    new neighborhoodLocation("Boston",42.3283505,-71.0605903,"It's less than an hour away from home!"),
    new neighborhoodLocation("New York",40.7033121,-73.979681,"Only ever been to upstate New York."),
    new neighborhoodLocation("Philadelphia",40.0047528,-75.1180329,"How civic of me."),
    new neighborhoodLocation("Atlanta",33.7677129,-84.420604,"Sure, why not?"),
    new neighborhoodLocation("New Orleans",30.0219504,-89.8830829,"Just not during hurricane season..."),
    new neighborhoodLocation("Toronto",43.7182713,-79.3777061,"Canadian enough for you?"),
    new neighborhoodLocation("Montreal",45.5601451,-73.7120832,"I went to Montreal once when I was five years old."),
    new neighborhoodLocation("Chicago",41.8337329,-87.7321555,"When the levee breaks, this is where you go."),
    new neighborhoodLocation("Austin",30.2638839,-97.7437884,"Keep Austin weird!"),
    new neighborhoodLocation("Portland",45.5424364,-122.654422,"Less wildfire prone than California. I should hope."),
    new neighborhoodLocation("Seattle",47.614848,-122.3359059,"It's all grungy."),
    new neighborhoodLocation("Vancouver",49.2569684,-123.1239135,"Beginning to notice my love of cities?"),
    new neighborhoodLocation("Rio de Janeiro",-22.066452,-42.9232368,"Brazil is an interesting nation to play as in Civilization V."),
    new neighborhoodLocation("Montevideo",-34.8200027,-56.2292752,"Uraguay is apparently quite nice these days."),
    new neighborhoodLocation("Buenos Aires",-34.6158533,-58.4332985,"I used to know a person from here."),
    new neighborhoodLocation("Valparaiso",-33.1163955,-71.5650318,"The &#34;Jewel of the Pacific&#34;. Then Panama stole its thunder."),
    new neighborhoodLocation("Cusco",-13.5300193,-71.9392491,"Filler"),
    new neighborhoodLocation("Dublin",53.3243201,-6.251695,"More emeralds per capita than anywhere outside Colombia."),
    new neighborhoodLocation("London",51.5286416,-0.1015987,"London was on its way to being the world capital, before the rest of the world caught up."),
    new neighborhoodLocation("Brussels",50.8387,4.363405,"Yes to the waffles... no to the sprouts."),
    new neighborhoodLocation("Amsterdam",52.3747158,4.8986142,"Filler"),
    new neighborhoodLocation("Frankfurt",50.121212,8.6365638,"I would have to brush up on my German before coming here."),
    new neighborhoodLocation("Hamburg",53.558572,9.9278215,"Second only to Berlin."),
    new neighborhoodLocation("Berlin",52.5075419,13.4251364,"Second to none, if Germans are your pleasure."),
    new neighborhoodLocation("Copenhagen",55.6712674,12.5608388,"Oop, looks like we're getting into metallic territory."),
    new neighborhoodLocation("Gothenburg",57.7019548,11.8936825,"Home to its own eponymous metal scene."),
    new neighborhoodLocation("Oslo",59.8938549,10.7851165,"Filler"),
    new neighborhoodLocation("Stockholm",59.326142,17.9875455,"Filler"),
    new neighborhoodLocation("Helsinki",60.1733244,24.9410248,"Filler"),
    new neighborhoodLocation("Saint Petersburg",59.9174455,30.3250575,"Filler"),
    new neighborhoodLocation("Gdańsk",54.3580866,18.6605014,"Filler"),
    new neighborhoodLocation("Warsaw",52.232938,21.0611941,"Filler"),
    new neighborhoodLocation("Krakow",50.0467656,20.0048731,"Hey there everyone, this is Krakow!"),
    new neighborhoodLocation("Prague",50.0596696,14.4656239,"Filler"),
    new neighborhoodLocation("Budapest",47.4805856,19.1303031,"I wrote a paper on 19th century Budapest in college."),
    new neighborhoodLocation("Vienna",48.2206849,16.3800599,"Vienna used to be the capital of a massive empire."),
    new neighborhoodLocation("Zurich",47.377455,8.536715,"I enjoy some portion of Swiss ancestry."),
    new neighborhoodLocation("Milan",45.4627338,9.1777323,"Filler"),
    new neighborhoodLocation("Rome",41.9100711,12.5359979,"Filler"),
    new neighborhoodLocation("Istanbul",41.0053215,29.0121795,"Was Constantinople. Now it's Istanbul."),
    new neighborhoodLocation("Damascus",33.5074755,36.2828954,"Insert groanworthy steel joke here. I'll have to wait until the region is more stable."),
    new neighborhoodLocation("Tel Aviv",32.0878802,34.797246,"See Damascus, replace steel with whatever the main export of Tel Aviv is."),
    new neighborhoodLocation("Cairo",30.0594885,31.2584644,"Filler"),
    new neighborhoodLocation("Tunis",36.7948829,10.1432776,"Filler"),
    new neighborhoodLocation("Algiers",36.752887,3.042048,"Filler"),
    new neighborhoodLocation("Tangier",35.7632691,-5.8336522,"Filler"),
    new neighborhoodLocation("Casablanca",33.5719036,-7.5873685,"An entire city full of film buffs? ...probably not."),
    new neighborhoodLocation("Moscow",55.749792,37.632495,"Filler"), 
    new neighborhoodLocation("Kazan",55.7955015,49.073303,"Filler"), 
    new neighborhoodLocation("Yekaterinburg",56.813891,60.6549335,"Gateway to the Urals."), 
    new neighborhoodLocation("Novosibirsk",54.969977,82.9494049,"As opposed to Omsk, the fortress of winged doom."), 
    new neighborhoodLocation("Irkutsk",52.2983873,104.26715,"You summerniks really burn me up!"), 
    new neighborhoodLocation("Vladivostok",43.173706,132.0358371,"Filler"), 
    new neighborhoodLocation("Magadan",59.5675693,150.8212876,"Yeah, it's a little chilly, but why should that stop you?"),
    //Get coords for: 

    //Moscow, Kazan, Yekaterinburg, Novosibirsk, Irkutsk, Vladivostok, Magadan
    //Seoul, Tokyo, Osaka, Harbin, Nanjing, Taipei, Xiamen, Urumqi, Ulaanbaatar
    //Add more locations like Central Asia, India, Southeast Asia, Australia/NZ, Subsaharan Africa

]);

//Knockoutify this? More importantly, make this a method of neighborhoodLocation?
function addMarker(neighborhoodLocation) {

    this.name = neighborhoodLocation.name;
    this.lat = neighborhoodLocation.lat;
    this.lng = neighborhoodLocation.lng;
    this.locationMarker = neighborhoodLocation.locationMarker;

    locationMarker.setMap(map);
    google.maps.event.addListener(locationMarker, 'click', function() {
        moveWindow(neighborhoodLocation);
        
    });
}

//moveWindow gets the content and position from the location, and attaches to the marker.
function moveWindow(neighborhoodLocation) {
    this.name = neighborhoodLocation.name;
    this.contentString = neighborhoodLocation.contentString;
    this.locationMarker = neighborhoodLocation.locationMarker;
    this.lat = neighborhoodLocation.lat;
    this.lng = neighborhoodLocation.lng;

    //We'll add an image to this later in the function.
    contentString = '<div id="infoWindow"> <p> <strong>Developer&#39;s note:</strong> ' + contentString + '</p> </div>';

    //Makes some AJAX requests.
    getRedditData(neighborhoodLocation);
    getWikipediaPage(neighborhoodLocation);

    //Data and function for a request to the Google Places API; this also uses AJAX
    var pictureRequest = {
        location: {lat: this.lat, lng: this.lng,},
        radius: '3000',
        //We need this variable to ensure photos are returned, but it doesn't return very relevant photos.
        name: name,
    }
    pictureService.nearbySearch(pictureRequest, getLocalLandmark);

    contentWindow.setContent(contentString);
    //Adding slightly to the latitude makes things look a little better.
    contentWindow.setPosition({lat: (locationMarker.position.lat() + 0.002), lng: locationMarker.position.lng()});

    contentWindow.open(map);
}

function getLocalLandmark(results, status){
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        var place = results[0];
        //If we get a place and a photo at all, then it's time to construct a request and add it to the page.
        //See https://developers.google.com/places/documentation/photos.
        if(place.photos != undefined){
            photoList = place.photos[0];
            photoURL = photoList.getUrl({'maxWidth': 200, 'maxHeight': 200});
            //console.log(photoURL);
            $("#infoWindow").append('<img src = "' + photoURL + '" alt="Image from Google Places API">')
            //As part of Google's policies, I am required to show the attribution for these pictures.
            if(photoList.html_attributions[0] != undefined){
                $("#infoWindow").append('<p>Source: ' + photoList.html_attributions[0] + '</p>');
            } else {$("#infoWindow").append("<p>Google doesn't seem to know where this image came from.</p>");}
        }else { $("#infoWindow").append('No image, beautify this error'); }

        //console.log($("#infoWindow").html());
        return place;
    } //Add a failure image of some sort for usability's sake
}

//Note things from here at that point: http://stackoverflow.com/questions/15317796/knockout-loses-bindings-when-google-maps-api-v3-info-window-is-closed
//Based on http://speckyboy.com/2014/01/22/building-simple-reddit-api-webapp-using-jquery/
//Use this link to make callbacks for this and the Wiki function work properly:
//http://stackoverflow.com/questions/14220321/how-to-return-the-response-from-an-ajax-call
function getRedditData(neighborhoodLocation) {
    this.name = neighborhoodLocation.name;
    //Pull five posts mentioning our location from Reddit's "travel" API
    var redditRequestURL = "http://www.reddit.com/r/travel/search.json?q=" + name + "&limit=5&sort=relevance&restrict_sr=0";
    var redditConstructor = "If you see this message, debug the Reddit functions.";
    $.getJSON(redditRequestURL, function(postSet){
        redditConstructor = "";
        var listing = postSet.data.children;
        //Iterate through the list and get some tags we can put in the HTML.
        for(var i = 0; i < listing.length; i++) {
            var obj = listing[i].data;
            var title = obj.title;
            //var subtime = obj.created_utc;
            var votes = obj.score;
            var redditurl = "http://www.reddit.com"+obj.permalink;
            //Create the HTML tags we need
            redditConstructor += '<li><a href="' + redditurl +'">' + title + '</a></li>';
            
        }
        if(redditConstructor == "") { redditConstructor = "We didn't find anything about " + name + " on /r/travel. Perhaps people just aren't interested?"}
        //console.log(redditConstructor);
    }).done(function() { SearchViewModel.redditHTML(redditConstructor); });
}

function getWikipediaPage(neighborhoodLocation) {
    this.name = neighborhoodLocation.name;
    wikiHTML = ""; //Cleanup
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + name + '&format=json&callback=wikiCallback';
    //Timeout isn't working yet.
    var wikiRequestTimeout = setTimeout(function(){
        wikiHTML = "Sorry, we didn't manage to get a Wikipedia page for this place.";
    }, 8000);
    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        jsonp: "callback",
        success: function( response ) {
            //console.log(response);
            //Variable defines for sanity and overall code readability.
            var mainArticle = response[1][0];
            var articleExcerpt = response[2][0];
            var articleURL = response[3][0];
            wikiHTML = "<div id='wikiData'><a href='" + articleURL + "'>" + mainArticle + "</a> - " +
                "<p>" + articleExcerpt + "</p>";
            //console.log(wikiHTML);

            clearTimeout(wikiRequestTimeout);
        },
        error: function() {
            wikiHTML = "Sorry, we didn't manage to get a Wikipedia page for this place.";
        }
    }).done(function() { SearchViewModel.wikiHTML(wikiHTML); });
}

function initialize() {
    var mapOptions = {
        center: { lat: 40.7033121, lng: -73.979681},
        zoom: 4
        };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    pictureService = new google.maps.places.PlacesService(map);

    //var infowindow = new google.maps.infoWindow({
    //    content: "Test",
    //});

    //Turn this into a Knockout observable array, and use a push function to add further stuff?
    //Add more things to the markers.
    //Displays the markers and populates the HTML list. 
    for(var i=0;i<locationList().length;++i)
    {
        addMarker(locationList()[i]);
    }
    for(var i=0;i<locationList().length;++i)
    {
        //SearchViewModel.HTMLLocs.push(locationList()[i].name);
    }

}

//This might need to be merged into a "controller" with showCorrespondingMarker below.
//Implementation cribbed from http://opensoul.org/2011/06/23/live-search-with-knockoutjs/
var SearchViewModel = {
    searchPrompt: ko.observable(""),
    HTMLLocs: ko.observableArray(),
    searchFilter: ko.observableArray(),
    redditHTML: ko.observable(""),
    wikiHTML: ko.observable(""),
    highlightedLocation: ko.observableArray(),
    //The way the applet is built now, you don't add new locations.
    search: function(value){
        //We need cleanup every time, but only run the actual search if there's a value.
        SearchViewModel.searchFilter([]);
        SearchViewModel.HTMLLocs([]);
        for(var x in locationList())
        {
            changeMarkerColor(locationList()[x].locationMarker, "red");
        }
        if(value != ""){
            for(var x in locationList())
            {
                if(locationList()[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0){
                    changeMarkerColor(locationList()[x].locationMarker, "yellow");
                    SearchViewModel.HTMLLocs.push(locationList()[x].name);
                }
            }
        }
    },
    getRoute: function(value){
        //Formerly showCorrespondingMarker(), but refactored for KnockoutJS. 
        //Runs if anything is selected in the search-generated list.
        if(value != undefined) {
            //Start by resetting the coloration of all the markers.
            for(var x in locationList())
            {
                changeMarkerColor(locationList()[x].locationMarker, "red");
            }
            //Then figure out which marker's in use. Center on it and turn blue if it's valid.
            selectedMarker = locationList().map(function(e) { return e.name }).indexOf(value);
            if(selectedMarker != -1) {
                changeMarkerColor(locationList()[selectedMarker].locationMarker, "blue");;
                map.setCenter({lat:locationList()[selectedMarker].lat, lng:locationList()[selectedMarker].lng});
            }
        }
    }    
}

//Since we're always changing these markers, I thought it might come in handy.
function changeMarkerColor(neighborhoodLocation, color){
    this.neighborhoodLocation = neighborhoodLocation;
    this.locationMarker = neighborhoodLocation.locationMarker;
    switch(color) {
        case "red": //Location is not "selected" in any fashion
            iconColor = 'images/red-dot.png';
            break;
        case "yellow": //Location got caught by the search function
            iconColor = 'images/yellow-dot.png';
            break;
        case "blue": //User has actually clicked on the location
            iconColor = 'images/blue-dot.png';
            break;
    }
    neighborhoodLocation.setIcon(iconColor);
}

//Dummied out for now.
/*
function showCorrespondingMarker() {
    //First, reset the marker coloration.
    console.log(highlightedLocation);
    for(var x in locationList)
    {
        locationList[x].locationMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
    }

    //This returns a DOM element, but rewrite it to use KnockoutJS's methods.
    var optionMarker = document.getElementById("locationOptions").value;
    //Get the corresponding index in our list of Google locations, using some prototype.map trickery.
    //Won't work in legacy browsers like IE8.
    var selectedMarker = locationList.map(function(e) { return e.name}).indexOf(optionMarker);

    //Centers the camera and turns the corresponding marker blue (Initially green, but colorblind people would complain).
    //Got some info from http://stackoverflow.com/questions/2818984/google-map-api-v3-center-zoom-on-displayed-markers; it might be irrelevant now.
    
    if(selectedMarker != -1) {
        locationList[selectedMarker].locationMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
        map.setCenter({lat:locationList[selectedMarker].lat, lng:locationList[selectedMarker].lng});
    }

}
*/

//Starts EVERYTHING when jQuery is loaded.
jQuery(function( $ ) {
    google.maps.event.addDomListener(window, 'load', initialize);
    ko.applyBindings(SearchViewModel);
    SearchViewModel.searchPrompt.subscribe(SearchViewModel.search);
});