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
		
	//declare module dependencies
	var MasterView = require('/ui/common/MasterView'),
		DetailView = require('/ui/common/DetailView');
		
	//construct UI
	var masterView = new MasterView(),
		detailView = new DetailView();
	
	//create detail view container
/*	var detailContainerWindow = Ti.UI.createWindow({
		modal:true,
		navBarHidden:true,
		backgroundColor:'#ffffff'
	});*/
	
	var detailContainerWindow = new ui.Window({
		modal:true,
		navBarHidden:true,
		backgroundColor:'#ffffff',
		backgroundImage:'../images/back.png'
	});
	
	
	detailContainerWindow.add(detailView);
	
	var topBar = new ActionBarView({
		type:'View Snap',
		pos: 'top'
	});
	

	
	detailContainerWindow.add(topBar.viewProxy);
	
	
	var bottomBar = new ActionBarView({
		pos: 'bottom',
		buttons: {
			btnEdit: {
				icon:'edit',
				width:80
			},
			btnTag: {
				icon:'tag',
				width:80
			},
			btnArchive: {
				icon:'archive',
				width:80
			},
			btnDelete: {
				icon:'delete',
				width:80
			}
		}
	});

	detailContainerWindow.add(bottomBar.viewProxy);
	
	Ti.include('/ui/common/snapCrud/selectorActions.js');
	
	bottomBar.addEventListener('buttonPress', function(e) {
		//e.id Tells us what button was pressed.
		//alert('a'+JSON.stringify(detailView.data['snap']['___id']));
		//alert('b'+JSON.stringify(detailView.data.snap));
		Ti.API.info('----------want to modify stuff from data---------'+JSON.stringify(detailView.data['snap']));
		doAction('ModifySnap', e.id, detailView, detailView.data['snap']);
	});
	
    //Modify Snap and Close relevant windows and refresh table
	detailView.addEventListener('modifySnapAndRefresh_step1', function(e) {
		masterView.SnapView.fireEvent('modifySnapAndRefresh_step2',e);
		detailContainerWindow.close();
	});
	
	//add behavior for master view
	masterView.SnapView.addEventListener('itemSelected', function(e) {
		detailView.data = e;
		Ti.API.info('looking for post_id '+JSON.stringify(e));
		//
		//detailContainerWindow.open();
		
			var masterModal = require('/ui/common/snapview/detailWindow');
			var w = masterModal();
			w.open();
		
		
			/*if (detailContainerWindow !== undefined){
				detailContainerWindow.close();
				detailContainerWindow.open();
			} else {
				//create window
				detailContainerWindow.open();
			}
*/		
		detailView.fireEvent('prepareView',e);
		return false;
	});
	
	
	topBar.addEventListener('close', function() {
		Ti.API.info('------------trying to close detail window');
		//detailContainerWindow.close();
		detailContainerWindow.close();
	});
	
	
	
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