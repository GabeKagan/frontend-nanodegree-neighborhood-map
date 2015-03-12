//A complete refactoring/rewrite of the old code, which was getting so disorganized that it could not even break.
//However, refactoring is creating scoping issues.

(function() {
//Globals?
var neighborhoodLocation;
var locationList;
var addMarker;



jQuery(function( $ ) {
    google.maps.event.addDomListener(window, 'load', initialize);
    ko.applyBindings(ViewModel);
    ViewModel.searchPrompt.subscribe(ViewModel.search);
});

function initialize() {
    var mapOptions = {
        center: { lat: 40.7033121, lng: -73.979681},
        zoom: 4,
        mapTypeControl: true,
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER
            },
        };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    pictureService = new google.maps.places.PlacesService(map);

    Model();
    View();
    //console.log(locationList());

    //Move these to View().
    for(var i=0;i<locationList().length;++i)
    {
        addMarker(locationList()[i]); //Needs scope fixing.
    }

}

var Model = function() {

    neighborhoodLocation = function(name, lat, lng, contentString) {
        var self = this; //I assume this has to be done to hook things into Knockout.js
        self.name = name;
        self.lat = lat;
        self.lng = lng;
        self.contentString =  contentString;
        //Placeholder. Latitude and longitude are hardcoded, so replace this with an error.
        if(lat === undefined) { lat = 0;}
        if(lng === undefined) { lng = 0;}
        //The initial comment string is a personal comment on the area.
        //Expand content string to include API pulls, HTML, etc. and such.
        //Now for variables derived from the initial ones, and from other sources.
        self.locationMarker = new google.maps.Marker({
            title: this.name,
            position: {lat: this.lat, lng: this.lng,},
            icon: "images/red-dot.png",
        });
    },

    getRedditData = function(neighborhoodLocation) {
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
                redditConstructor += '<li class="redditLink"><a href="' + redditurl +'">' + title + '</a></li>';
                
            }
            if(redditConstructor == "") { redditConstructor = "We didn't find anything about " + name + " on /r/travel. Perhaps people just aren't interested?"}
            //At the end of the function, either send our shiny HTML to Knockout or inform the user the AJAX request failed.
        }).done(function() { ViewModel.redditHTML(redditConstructor); 
        }).error(function() { 
            ViewModel.redditHTML("<p>Unable to get any response from Reddit at all. This could be caused by, amongst other things, Reddit going down in flames. <br> <img id = 'sadFace' src = 'images/sadface.png' alt='Pixelated sad face'> </p>") 
        });
    },

    getWikipediaPage = function(neighborhoodLocation) {
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
                wikiHTML = "<div id='wikiData'><p><a href='" + articleURL + "'>" + mainArticle + "</a> - " +
                    articleExcerpt + "</p>";
                //console.log(wikiHTML);

                clearTimeout(wikiRequestTimeout);
            },
            error: function() {
                wikiHTML = "Sorry, we didn't manage to get a Wikipedia page for this place.";
            }
        }).done(function() { ViewModel.wikiHTML(wikiHTML); 
        }).error(function() {
            ViewModel.wikiHTML("<p>Unable to get any response from Wikipedia at all. Did you forget to donate? <br> <img id = 'sadFace' src = 'images/sadface.png' alt='Pixelated sad face'> </p>");
        });
    },    

    locationList = ko.observableArray([
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
    new neighborhoodLocation("Cusco",-13.5300193,-71.9392491,"Positively Andean."),
    new neighborhoodLocation("Dublin",53.3243201,-6.251695,"More emeralds per capita than anywhere outside Colombia."),
    new neighborhoodLocation("London",51.5286416,-0.1015987,"London was on its way to being the world capital, before the rest of the world caught up."),
    new neighborhoodLocation("Brussels",50.8387,4.363405,"Yes to the waffles... no to the sprouts."),
    new neighborhoodLocation("Amsterdam",52.3747158,4.8986142,"Filler"),
    new neighborhoodLocation("Frankfurt",50.121212,8.6365638,"I would have to brush up on my German before coming here."),
    new neighborhoodLocation("Hamburg",53.558572,9.9278215,"Second only to Berlin."),
    new neighborhoodLocation("Berlin",52.5075419,13.4251364,"Second to none, if Germans are your pleasure."),
    new neighborhoodLocation("Copenhagen",55.6712674,12.5608388,"Oop, looks like we're getting into metallic territory."),
    new neighborhoodLocation("Gothenburg",57.7019548,11.8936825,"Home to its own eponymous metal scene."),
    new neighborhoodLocation("Oslo",59.8938549,10.7851165,"Norway used to be part of Denmark. I blame the Kalmar Union."),
    new neighborhoodLocation("Stockholm",59.326142,17.9875455,"Like Gothenburg, Stockholm was a nexus of Swedish metal musicians."),
    new neighborhoodLocation("Helsinki",60.1733244,24.9410248,"Is that you, Urho Kekkonen?"),
    new neighborhoodLocation("Saint Petersburg",59.9174455,30.3250575,"Unfortunately, not home to Peter Griffin."),
    new neighborhoodLocation("Gdańsk",54.3580866,18.6605014,"Forget Constantinople. THIS is the &#34;City of the World's Desire&#34;."),
    new neighborhoodLocation("Warsaw",52.232938,21.0611941,"A major cultural center, at least for the Polish."),
    new neighborhoodLocation("Krakow",50.0467656,20.0048731,"Hey there everyone, this is Krakow!"),
    new neighborhoodLocation("Prague",50.0596696,14.4656239,"Always with the big, obvious cities, this guy."),
    new neighborhoodLocation("Budapest",47.4805856,19.1303031,"I wrote a paper on 19th century Budapest in college."),
    new neighborhoodLocation("Vienna",48.2206849,16.3800599,"Vienna used to be the capital of a massive empire."),
    new neighborhoodLocation("Zurich",47.377455,8.536715,"I enjoy some portion of Swiss ancestry."),
    new neighborhoodLocation("Milan",45.4627338,9.1777323,"Pepperidge Farm remembers."),
    new neighborhoodLocation("Rome",41.9100711,12.5359979,"SQPR"),
    new neighborhoodLocation("Istanbul",41.0053215,29.0121795,"Was Constantinople. Now it's Istanbul."),
    new neighborhoodLocation("Damascus",33.5074755,36.2828954,"Insert groanworthy steel joke here. I'll have to wait until the region is more stable."),
    new neighborhoodLocation("Tel Aviv",32.0878802,34.797246,"See Damascus, replace steel with whatever the main export of Tel Aviv is."),
    new neighborhoodLocation("Cairo",30.0594885,31.2584644,"Compared to many famous Egyptian cities, Cairo is but a baby, forged by Fatimids."),
    new neighborhoodLocation("Tunis",36.7948829,10.1432776,"You can tune a piano, but you can't tune a Tunis."),
    new neighborhoodLocation("Algiers",36.752887,3.042048,"Why do I have so many North African destinations here? I HATE hot weather."),
    new neighborhoodLocation("Tangier",35.7632691,-5.8336522,"I'll try to lay off making fun of these cities' names from here on out."),
    new neighborhoodLocation("Casablanca",33.5719036,-7.5873685,"An entire city full of film buffs? ...probably not."),
    new neighborhoodLocation("Moscow",55.749792,37.632495,"If it weren't for those gosh durned Mongols, Kiev would've taken its place as the center of Rus power."), 
    new neighborhoodLocation("Kazan",55.7955015,49.073303,"Formerly the capital of a powerful and eponymous khanate."), 
    new neighborhoodLocation("Yekaterinburg",56.813891,60.6549335,"Gateway to the Urals."), 
    new neighborhoodLocation("Novosibirsk",54.969977,82.9494049,"As opposed to Omsk, the fortress of winged doom."), 
    new neighborhoodLocation("Irkutsk",52.2983873,104.26715,"You summerniks really burn me up!"), 
    new neighborhoodLocation("Vladivostok",43.173706,132.0358371,"Despite the Vlads, not much Dracula here."), 
    new neighborhoodLocation("Magadan",59.5675693,150.8212876,"Yeah, it's a little chilly, but why should that stop you?"),
    new neighborhoodLocation("Seoul",37.5651,126.98955,"You must construct additional pylons."),
    new neighborhoodLocation("Tokyo",35.673343,139.710388,"This is where the crack hits the brain, at least if you have even the slightest interest in Japanese culture."),
    new neighborhoodLocation("Osaka",34.6784,135.49515,"If I ever get to Japan, I'm going to try and see more than just the Tokyo megalopolis."),
    new neighborhoodLocation("Harbin",45.75723,126.6520214,"Dude! Ice sculptures!"),
    new neighborhoodLocation("Nanjing",32.0992691,118.7377506,"Why here instead of elsewhere in China? ...Iuno."),
    new neighborhoodLocation("Taipei",24.3394104,121.9430084,"Also the name of a mahjong solitare implementation for Windows 3.1."),
    new neighborhoodLocation("Xiamen",24.4791977,118.1092072,"Depicted in parts of <i>REAMDE</i> by Neal Stephenson."),
    new neighborhoodLocation("Urumqi",43.8217127,87.5627517,"Xinjiang is basically its own country."),
    new neighborhoodLocation("Ulaanbaatar",47.8916501,106.9018714,"One of the many cities whose name improved over time.")
    ]);

}

var ViewModel = {
    //This might need to be merged into a "controller" with showCorrespondingMarker below.
    //Implementation cribbed from http://opensoul.org/2011/06/23/live-search-with-knockoutjs/
    searchPrompt: ko.observable(""),
    HTMLLocs: ko.observableArray(),
    searchFilter: ko.observableArray(),
    redditHTML: ko.observable(""),
    wikiHTML: ko.observable(""),
    highlightedLocation: ko.observableArray(),
    //The way the applet is built now, you don't add new locations.
    search: function(value){
        //We need cleanup every time, but only run the actual search if there's a value.
        ViewModel.searchFilter([]);
        ViewModel.HTMLLocs([]);
        for(var i in locationList())
        {
            changeMarkerColor(locationList()[i].locationMarker, "red");
        }
        if(value != ""){

            for(var i in locationList()) //Refactored funciton can't find locationList!
            {
                console.log("Test");
                if(locationList()[i].name.toLowerCase().indexOf(value.toLowerCase()) >= 0){
                    changeMarkerColor(locationList()[i].locationMarker, "yellow");
                    ViewModel.HTMLLocs.push(locationList()[i].name);
                }
            }
        }
    },
    getRoute: function(value){
        //Formerly showCorrespondingMarker(), but refactored for KnockoutJS. 
        //Runs if anything is selected in the search-generated list.
        if(value != undefined) {
            //Start by resetting the coloration of all the markers.
            for(var i in Model.locationList())
            {
                changeMarkerColor(Model.locationList()[i].locationMarker, "red");
            }
            //Then figure out which marker's in use. Center on it and turn blue if it's valid.
            selectedMarker = Model.locationList().map(function(e) { return e.name }).indexOf(value);
            if(selectedMarker != -1) {
                changeMarkerColor(Model.locationList()[selectedMarker].locationMarker, "blue");
                map.setCenter({lat:Model.locationList()[selectedMarker].lat, lng:Model.locationList()[selectedMarker].lng});
                moveWindow(Model.locationList()[selectedMarker]);
            }
        }
    },

    getLocalLandmark: function(results, status){
        if (status === google.maps.places.PlacesServiceStatus.OK) {
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
                } else {$("#infoWindow").append("<p>Google Places has no attribution information for this picture.</p>");}

            } else { $("#infoWindow").append('<p>Google Places has no pictures for this location.</p>'); }
            return place;
        //If the request is completely unsuccessful, inform the user of our humiliation.
        } else { $("#infoWindow").append("<p>It looks like our Google Places API request completely failed! <br> <img id = 'sadFace' src = 'images/sadface.png' alt='Pixelated sad face'></p>"); }
    },

    //moveWindow gets the content and position from the location, and attaches to the marker.
    moveWindow: function(neighborhoodLocation) {
        this.name = neighborhoodLocation.name;
        this.contentString = neighborhoodLocation.contentString;
        this.locationMarker = neighborhoodLocation.locationMarker;
        this.lat = neighborhoodLocation.lat;
        this.lng = neighborhoodLocation.lng;

        //contentString neews some formatting.
        //contentString = '<div id="infoWindow"> <p> <strong>Developer&#39;s note:</strong> ' + contentString + '</p> </div>';

        //Makes some AJAX requests.
        getRedditData(neighborhoodLocation);
        getWikipediaPage(neighborhoodLocation);

        //Data and function for a request to the Google Places API; this also uses AJAX.
        var pictureRequest = {
            location: {lat: this.lat, lng: this.lng,},
            radius: '5000',
            //We need this variable to ensure photos are returned, but the photos aren't very good.
            name: name,
        }
        pictureService.nearbySearch(pictureRequest, getLocalLandmark);
        contentWindow.setContent(contentString);
        contentWindow.setPosition({lat: locationMarker.position.lat(), lng: locationMarker.position.lng()});
        contentWindow.open(map);
    }
}

var View = function () {

    addMarker = function(neighborhoodLocation) {
        this.name = neighborhoodLocation.name;
        this.lat = neighborhoodLocation.lat;
        this.lng = neighborhoodLocation.lng;
        this.locationMarker = neighborhoodLocation.locationMarker;

        locationMarker.setMap(map);
        google.maps.event.addListener(locationMarker, 'click', function() {
            ViewModel.moveWindow(neighborhoodLocation);    
        });
    }

    changeMarkerColor = function(neighborhoodLocation, color){
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

}

})();