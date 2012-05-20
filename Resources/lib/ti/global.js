// JavaScript Document

	var _ = require('/lib/thirdParty/underscore'),
	theme = require('/lib/ti/theme'),
	ui = require('/lib/ti/components');
	
	//Ti.taffy = require('/lib/thirdParty/ti.taffydb').taffyDb;
	
	Ti.include('/lib/ti/config.js');
	
	var deviceID = Titanium.Platform.id;
	
	var Cloud = require('ti.cloud');
	Cloud.debug = true;  // optional; if you add this line, set it to false for production

	var isLoggedIn = Titanium.App.Properties.getString('loggedIn',"false");
	if(isLoggedIn=="true")
	{
		//Ti.API.info('------------------is logged in (global.js)');
		var userID = Titanium.App.Properties.getString('userID');
		//Ti.API.info('uid' + userID);
		var user = Titanium.App.Properties.getList(userID);
		//Ti.API.info(JSON.stringify(user));
		//Ti.API.info(user);
	}

	
	//check gps location and store in variable for adding last location ??
	
	var osname = Ti.Platform.osname,
	version = Ti.Platform.version,
	screenHeight = Ti.Platform.displayCaps.platformHeight,
	screenWidth = Ti.Platform.displayCaps.platformWidth;
	
	 
	function GetHeight(value) {
		var temp = (value * 100) / 480;
		return parseInt((screenHeight * temp) / 100);
	}
	 
	function GetWidth(value) {
		var temp = (value * 100) / 320;
		return parseInt((screenWidth * temp) / 100);
	}

	
	
	if(osname === 'android')
	{
		var bugsense = require("com.droisys.bugsense");
		bugsense.setup(apiKeys.bugsense);
		Ti.API.info("module is => " + bugsense);
		//broken
	}
	else
	{
		var testflight = require("com.0x82.testflight");
		testflight.takeOff(testflight.takeOff(apiKeys.teamToken))
	}
	
	
	var isTablet = osname === 'ipad' || (osname === 'android' && (screenWidth > 899 || screenHeight > 899));
	
	function iconPath(icon,pos) 
	{
		var tabletExt = (isTablet) ? '@2x' : ''; 
		//var colour = (pos=='top') ? 'white' : 'grey' ;
		var retVal = '/images/glyph/grey/'+icon+tabletExt+'.png';
		Ti.API.info('------------icon url is '+retVal);
		return retVal;
	}