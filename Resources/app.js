/*
 * 
 * In app.js, we generally take care of a few things:
 * - Bootstrap the application with any data we need
 * - Check for dependencies like device type, platform version or network connection
 * - Require and open our top-level UI component
 *  
 */

	
	Ti.include('/lib/ti/global.js');
	Ti.include('/lib/thirdParty/taffy.js');	
	
	//determine platform and form factor and render approproate components
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
	
	//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
	//yourself what you consider a tablet form factor for android
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
	
//	//require and open top level UI component
//	var Window;
//	if (isTablet) {
//		Window = require('ui/tablet/ApplicationWindow');
//	}
//	else {
//		if (osname === 'android') {
//			//Window = require('ui/handheld/android/ApplicationWindow');
//			Window = require('ui/handheld/android/ApplicationWindow');
//		}
//		else {
//			Window = require('ui/handheld/ios/ApplicationWindow');
//		}
//	}
//	
//	if(osname !== 'android')
//	{
//		//var testflight = require("com.0x82.testflight");
//	}
	
	var FirstWindow = require('ui/common/ApplicationWindow');
		
	new FirstWindow().open();
