Ti.include('/lib/ti/global.js');

function AuthenticationSliderView(self)
{
	var AuthenticationView = require('ui/common/authentication/AuthenticationView');
	//construct UI
	var authenticationView = new AuthenticationView();
	
	authenticationView.addEventListener('authenticated', function(user) {
		self.remove(authenticationView);
		var mainV = MasterDetailView(self);
		self.add(mainV);
		return false;
	});
		
	return authenticationView;
}

function PinView()
{
	var PinView = require('/ui/common/authentication/PinView');
	//construct UI
	var pinView = new PinView();
	return pinView;
}


function MasterDetailView(self)
{
	var ActionBarView = require('/ui/common/shared/ActionBarView');
		
	var MasterView = require('/ui/common/MasterView');
		
	//construct UI
	var masterView = new MasterView();
	
	masterView.addEventListener('unauthenticated', function(user) {
		self.remove(masterView);
		var asV = AuthenticationSliderView(self);
		self.add(asV);
		return false;
	});
	
	return masterView;
}


function ApplicationWindow() {
	
	//create object instance //this is the main window
	var self = Ti.UI.createWindow({
		exitOnClose:true,
		navBarHidden:true,
		backgroundColor:'#ffffff'
	});
	
	self.orientationModes = [Ti.UI.PORTRAIT];
	
	var isLoggedIn = Titanium.App.Properties.getString('loggedIn',false);
	Ti.API.info('------------------------is logged in ? ' + isLoggedIn);
	
	if(isLoggedIn=='false' || isLoggedIn==false )
	{
		//No UserID stored so show login screen (with register and forgot password options)
		Ti.API.info('------------------------Loading Authentication View');
		var firstV = AuthenticationSliderView(self);
	}
	else if(Ti.App.Properties.hasProperty('usePin') && Ti.App.Properties.getProperty('usePin'))
	{
		//If using pin option and logged in show pin window
		Ti.API.info('------------------------Open Pin Window');
		var firstV = PinView(self);
	}
	else
	{
		//Main snaps window
		Ti.API.info('------------------------Loading Master Detail View in Main Window');
		var firstV = MasterDetailView(self);
	}

	self.add(firstV);
	
			
	return self;
};

module.exports = ApplicationWindow;