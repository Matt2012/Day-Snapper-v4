// JavaScript Document

	var _ = require('/lib/thirdParty/underscore'),
	theme = require('/lib/ti/theme'),
	ui = require('/lib/ti/components');
	
	var Cloud = require('ti.cloud');
	Cloud.debug = true;  // optional; if you add this line, set it to false for production

	var isLoggedIn = Titanium.App.Properties.getString('loggedIn',false);
	if(isLoggedIn===true)
	{
		Ti.API.info('------------------is logged in (global.js)');
		var userID = Titanium.App.Properties.getString('userID');
		Ti.API.info('uid' + userID);
		var user = Titanium.App.Properties.getList(userID);
		
		Ti.API.info(JSON.stringify(user));
		Ti.API.info(user);
	}
	
	var osname = Ti.Platform.osname,
	version = Ti.Platform.version,
	height = Ti.Platform.displayCaps.platformHeight,
	width = Ti.Platform.displayCaps.platformWidth;
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
	
	function iconPath(icon,pos) 
	{
		var tabletExt = (isTablet) ? '@2x' : ''; 
		//var colour = (pos=='top') ? 'white' : 'grey' ;
		return '/images/glyph/grey/'+icon+tabletExt+'.png';
	}