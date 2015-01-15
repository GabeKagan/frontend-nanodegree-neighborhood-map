/*Model requirements:

#4: Locations of interest
#5: Gotta find out what we're searching for, first. 
#6: Locations from #4?


*/

function initialize() {
    var mapOptions = {
        center: { lat: 42.5792, lng: -71.4383},
        zoom: 14
        };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    }

function SearchViewModel() {
    this.searchPrompt = ko.observable("Test");
}


jQuery(function( $ ) {
    google.maps.event.addDomListener(window, 'load', initialize);
    ko.applyBindings(new SearchViewModel());
});