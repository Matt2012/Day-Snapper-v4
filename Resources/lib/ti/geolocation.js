//
//  SET ACCURACY - THE FOLLOWING VALUES ARE SUPPORTED
//
// Titanium.Geolocation.ACCURACY_BEST
// Titanium.Geolocation.ACCURACY_NEAREST_TEN_METERS
// Titanium.Geolocation.ACCURACY_HUNDRED_METERS
// Titanium.Geolocation.ACCURACY_KILOMETER
// Titanium.Geolocation.ACCURACY_THREE_KILOMETERS
//
Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;

//
//  SET DISTANCE FILTER.  THIS DICTATES HOW OFTEN AN EVENT FIRES BASED ON THE DISTANCE THE DEVICE MOVES
//  THIS VALUE IS IN METERS
//
Titanium.Geolocation.distanceFilter = 10; 
Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_NETWORK;

var locationAdded = false;
/*
var locationAdded = false;
var handleLocation = function(e) {
    if (!e.error) {
        Ti.API.info(e.coords);
    }
};
var addHandler = function() {
    if (!locationAdded) {
        Ti.Geolocation.addEventListener('location', handleLocation);
        locationAdded = true;
        Ti.API.info("Adding Ti.Geolocation.addEventListener('location', handleLocation)");
    }
};
var removeHandler = function() {
    if (locationAdded) {
        Ti.Geolocation.removeEventListener('location', handleLocation);
        locationAdded = false;
        Ti.API.info("Removing Ti.Geolocation.removeEventListener('location', handleLocation)");
    }
};
 
var locationCallback = function(){
	
} 

if (Ti.Geolocation.locationServicesEnabled) {
    addHandler();
    Ti.API.info("Adding addHandler()");
    var activity = Ti.Android.currentActivity;
    activity.addEventListener('destroy', removeHandler);
    activity.addEventListener('pause', removeHandler);
    activity.addEventListener('resume', addHandler);
} else {
    alert('Please enable location services');
    Ti.API.info("No action required from this module");
}

module.exports = addHandler;
module.exports = removeHandler;
*/


	//
	// EVENT LISTENER FOR GEO EVENTS - THIS WILL FIRE REPEATEDLY (BASED ON DISTANCE FILTER)
	//
	var locationCallback2 = function(e)
	{
		if (!e.success || e.error)
		{
			updatedLocation.text = 'error:' + JSON.stringify(e.error);
			updatedLatitude.text = '';
			updatedLocationAccuracy.text = '';
			updatedLocationTime.text = '';
			Ti.API.info("Code translation: "+translateErrorCode(e.code));
			return;
		}

		var longitude = e.coords.longitude;
		var latitude = e.coords.latitude;
		var altitude = e.coords.altitude;
		var heading = e.coords.heading;
		var accuracy = e.coords.accuracy;
		var speed = e.coords.speed;
		var timestamp = e.coords.timestamp;
		var altitudeAccuracy = e.coords.altitudeAccuracy;

		//Titanium.Geolocation.distanceFilter = 100; //changed after first location event

		updatedLocation.text = 'long:' + longitude;
		updatedLatitude.text = 'lat: '+ latitude;
		updatedLocationAccuracy.text = 'accuracy:' + accuracy;
		updatedLocationTime.text = 'timestamp:' +new Date(timestamp);

		updatedLatitude.color = 'red';
		updatedLocation.color = 'red';
		updatedLocationAccuracy.color = 'red';
		updatedLocationTime.color = 'red';
		setTimeout(function()
		{
			updatedLatitude.color = '#444';
			updatedLocation.color = '#444';
			updatedLocationAccuracy.color = '#444';
			updatedLocationTime.color = '#444';

		},100);

		// reverse geo
		Titanium.Geolocation.reverseGeocoder(latitude,longitude,function(evt)
		{
			if (evt.success) {
				var places = evt.places;
				if (places && places.length) {
					reverseGeo.text = places[0].address;
				} else {
					reverseGeo.text = "No address found";
				}
				Ti.API.debug("reverse geolocation result = "+JSON.stringify(evt));
			}
			else {
				Ti.UI.createAlertDialog({
					title:'Reverse geo error',
					message:evt.error
				}).show();
				Ti.API.info("Code translation: "+translateErrorCode(e.code));
			}
		});
		Titanium.API.info('geo - location updated: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
	};//locationCallback2



function translateErrorCode(code) {
	if (code == null) {
		return null;
	}

	switch (code) {
		case Ti.Geolocation.ERROR_LOCATION_UNKNOWN:
			return "Location unknown";
		case Ti.Geolocation.ERROR_DENIED:
			return "Access denied";
		case Ti.Geolocation.ERROR_NETWORK:
			return "Network error";
		case Ti.Geolocation.ERROR_HEADING_FAILURE:
			return "Failure to detect heading";
		case Ti.Geolocation.ERROR_REGION_MONITORING_DENIED:
			return "Region monitoring access denied";
		case Ti.Geolocation.ERROR_REGION_MONITORING_FAILURE:
			return "Region monitoring access failure";
		case Ti.Geolocation.ERROR_REGION_MONITORING_DELAYED:
			return "Region monitoring setup delayed";
	}
}	


var locationCallback = function(e) {
  var msg = null;
  if(Ti.Geolocation.locationServicesEnabled) {

    Titanium.Geolocation.getCurrentPosition(function(e) {
      var longitude = e.coords.longitude;
      var latitude = e.coords.latitude;
      msg = ' NO ERRORS on LOCATION my Coords are: ' + longitude + ' - ' + latitude;
      Ti.API.info(msg);
      alert(msg);
    });

  } else {//if enabled

    if(!e.success || e.error) {
      msg = 'error:' + JSON.stringify(e.error);
      msg += "Code translation: " + translateErrorCode(e.error.code);
      Ti.API.info(msg);
      alert('Please turn on Location Services to enable this Push Notification');
      return;
    }
  }
};





function OnAppStart()
{
		Ti.API.info("start event received");
		Ti.API.info("adding location callback on Start");
			Titanium.Geolocation.addEventListener('location', locationCallback);

}

function OnAppResume()
{
		Ti.API.info("resume event received");
		if(!locationAdded) {
			Ti.API.info("adding location callback on resume");
			Titanium.Geolocation.addEventListener('location', locationCallback);
			locationAdded = true;
		}
}
 
function OnAppPause()
{
		Ti.API.info("pause event received");
		if(locationAdded) {
			Ti.API.info("removing location callback on pause");
			Titanium.Geolocation.removeEventListener('location', locationCallback);
			locationAdded = false;
		}
}
 
function OnAppDestroy()
{
		Ti.API.info("destroy event received");
		if(locationAdded) {
			Ti.API.info("removing location callback on destroy");
			Titanium.Geolocation.removeEventListener('location', locationCallback);
			locationAdded = false;
		}
}
 

exports.run = function( myActivity ) {

	Ti.API.info(' Current Activity: ' + myActivity);
	locationAdded = true;
	//  as the destroy handler will remove the listener, only set the pause handler to remove if you need battery savings
	myActivity.addEventListener('start',  OnAppStart);				
	myActivity.addEventListener('pause',  OnAppPause);
	myActivity.addEventListener('destroy',OnAppDestroy);
	myActivity.addEventListener('resume', OnAppResume);


};


/*
	var intent = Ti.Android.createIntent({
        action: Ti.Android.ACTION_MAIN
    });
    intent.addCategory(Ti.Android.CATEGORY_HOME);
    Ti.Android.currentActivity.startActivity(intent); 
*/
