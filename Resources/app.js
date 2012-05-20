/*
 * 
 * In app.js, we generally take care of a few things:
 * - Bootstrap the application with any data we need
 * - Check for dependencies like device type, platform version or network connection
 * - Require and open our top-level UI component
 *  
 */
//var basicGeo = require('bencoding.basicgeo');
//Ti.API.info("module is => " + basicGeo);

	Titanium.App.Properties.setString('autoSync', "true"); //used to signal not yet autosynced this session
	
	var FirstWindow = require('ui/common/ApplicationWindow');
		
	new FirstWindow().open();
