# frontend-nanodegree-neighborhood-map
My implementation of the 5th project in Udacity's Front-End Web Developer Nanodegree - the "Neighborhood Map".

Instead of limiting myself to a simple neighborhood, I decided to look at the entire world as seen through the eyes of Google Maps. By looking at this map, you can get a feel for some of the many places in the world I want to visit. It's not entirely representative of every single place that interests me, but it should give travel agency types enough information to guess where I might be interested in.

This is a fairly simple application to use if you are in any way familiar with Google Maps. Besides the basic controls of that application, this program is operated primarily through interacting with the markers; there are two ways to do this.

1. Click on a marker to get the name of a location, a list of discussions about on /r/travel (a Reddit subforum), a Wikipedia page for the area, a hopefully relevant picture pulled from Google's Places API, and a goofy comment from me, the developer.
2. Type into the search bar at the upper right; as you type, locations with your search query as a substring will show up in the list below you. Any of these that are visible on the map will then change colors from red to yellow. If you select a location from the list, its marker will turn blue, and pull up an info window as if you'd clicked upon it.

From a technical stance, all of this code appears to be working, and reasonably performant. I am not sure how to ensure that the pictures I recieve from Google Places are relevant, but they at least appear to be taken within some distance of the GPS coordinates for each city. One problem that still troubles me is improving the user experience on mobile devices with small screens; Google Maps itself doesn't seem very small-screen friendly. In short, I would not recommend running this on a screen smaller than, let's say 800*480. 

Now for the positives - this applet makes good use of the required Knockout framework to separate its data and UI, which had the side effect of making asynchronous implementation of data pulls easier once I figured out how and why. All required functionality should be implemented and bug free, and in some cases extended beyond the requirements in logical ways. Furthermore, I've upgraded my "build" process to make usage of node.js and Gulp, which gives me a more robust minification process than the Microsoft Ajax Minifier I used in the last project.

A live version of this website is available at http://gabekagan.github.io/frontend-nanodegree-neighborhood-map/. Its functionality should be synchronized with the development version at all times.
