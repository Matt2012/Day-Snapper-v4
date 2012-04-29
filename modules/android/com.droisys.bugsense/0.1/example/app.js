//This Module is for integrating Bugsense which helps for testing
//of the app either during development or after deployment to market.

//Since Titanium handles most of the Runtime Error, this module will 
//help only when app force closes.

//In this example we have code which crashes the app on android that is not handled by titanium.
// You will see the Bug report and stack trace in bugsense webpage


// open a single window
var window = Ti.UI.createWindow({
	backgroundColor:'white'
});


// TODO: write your module tests here
var bugsense = require('com.droisys.bugsense');

if (Ti.Platform.name == "android") {
	bugsense.startTracking("YOUR BUGSENSE API KEY");
}

var mountainView = Titanium.Map.createAnnotation({
    latitude:37.390749,
    longitude:-122.081651,
    title:"Appcelerator Headquarters",
    subtitle:'Mountain View, CA',
    pincolor:Titanium.Map.ANNOTATION_RED,
    animate:true,
    leftButton: '../images/appcelerator_small.png',
    myid:1 // CUSTOM ATTRIBUTE THAT IS PASSED INTO EVENT OBJECTS
});

var mapview = Titanium.Map.createView({
    mapType: Titanium.Map.STANDARD_TYPE,
    region: {latitude:33.74511, longitude:-84.38993, 
            latitudeDelta:0.01, longitudeDelta:0.01},
    animate:true,
    regionFit:true,
    userLocation:true,
    annotations:[mountainView]
});

window.add(mapview);

var mapview2 = Titanium.Map.createView({
    mapType: Titanium.Map.STANDARD_TYPE,
    region: {latitude:33.74511, longitude:-84.38993, 
            latitudeDelta:0.01, longitudeDelta:0.01},
    animate:true,
    regionFit:true,
    userLocation:true,
    annotations:[mountainView]
});

window.add(mapview2);

window.open();

//Thats it. you can continue your code further and bugsense will handle force closes