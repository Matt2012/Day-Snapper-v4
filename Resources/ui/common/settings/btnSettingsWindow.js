// all the magic happens here
Ti.include('/lib/ti/global.js');
Ti.include('/ui/common/settings/settingsInclude.js');

function addPreference(options) {
	var self = options.self;
	var disabled = !options.onclick && !options.myitems;
	var hasDescription = options.description || options.myitems;
	var hasCheckbox = options.checked != undefined;
	var hasButton = options.button != undefined;

	if(options.myitems && options.selectedItem) {
		options.selectedIndex = options.myitems.indexOf(options.selectedItem);
	}

	var row = Ti.UI.createTableViewRow({height:'auto', hasChild: !!options.myitems});

	if(options.header) {
		row.header = options.header;
	}

	var label1 = Titanium.UI.createLabel({
		text: options.title,
		color: disabled ? '#bdbebd' : '#999',
		font:{fontSize:22},
		left: 10
	});

	if(hasDescription) {
		label1.top = 5;
	}
	row.add(label1);

	var lblDesc;

	function updateDescriptionLabel() {
		if(options.myitems) {
			lblDesc.text = options.myitems[options.selectedIndex];

			if(options.prefix) {
				lblDesc.text = options.prefix + lblDesc.text;
			}
		} else {
			lblDesc.text = options.description;
		}

	};

	if(hasDescription) {
		
	lblDesc = Titanium.UI.createLabel({
		color: '#bdbebd',
		font:{fontSize:14},
		left: 10,
		width:230,
		top: 35,
		bottom: 10
	});

	updateDescriptionLabel();

	self.myDesc[options.id] = lblDesc;

	row.add(lblDesc);
	}

	if(hasCheckbox) {
		var sw = Ti.UI.createSwitch({
			right: 10,
			value: options.checked
		});
		sw.addEventListener('change', function(e) {
			options.onchange(e.value);
		});
		row.add(sw);
	}
	
	if(hasButton) {
		var btn = Ti.UI.createButton({
			title: options.button,
			right:10
		});
		
/*		btn.addEventListener("click", function() {
			options.onclick();
		});*/
		row.add(btn);
	}


	if(options.myitems) {
		row.addEventListener('click', function() {
			var items = options.myitems;
	
			if(options.prefix) {
				doItems = [];
				for(var i=0; i<options.myitems.length; i++) {
					doItems.push(options.prefix + options.myitems[i]);
				}
			}
	
			var dialog = Titanium.UI.createOptionDialog({
				options: doItems,
				selectedIndex: options.selectedIndex,
				title: options.title
			});
	
			dialog.addEventListener('click', function(e) {
				if(e.index >= 0) {
					options.selectedIndex = e.index;
					updateDescriptionLabel();
					options.onselect(options.myitems[e.index]);
					}
			});
	
			dialog.show();

		});
	} else if(options.onclick) {
		row.addEventListener('click', options.onclick);
	}

	options.table.appendRow(row);
}
// the following code is both the logic and examples of using it
function settingsWindow() {
	
	//Ti.include('../../../lib/ti/global.js');
	var ActionBarView = require('/ui/common/shared/ActionBarView');
	//parseapi = require('com.forge42.parseapi');
	
	var self = new ui.Window({
		backgroundColor:'white',
		modal:true,
		navBarHidden:true
	});
	
	var topBar = new ActionBarView({
		type:'Settings',
		pos:'top'
	});
	
	topBar.addEventListener('close', function() {
		self.close();
	});

	self.add(topBar.viewProxy);
	self.myDesc = [];
	//
	var testPref = Titanium.App.Properties.getString('testPref','Item A');
	var usePinCode = Titanium.App.Properties.getString('usePinCode',false);
	var PinCode = Titanium.App.Properties.getString('PinCode','0000');
	var Name = Titanium.App.Properties.getString('Name','');
	var syncTextWifiOnly = Titanium.App.Properties.getString('syncTextWifiOnly',false);
	var syncImagesWifiOnly = Titanium.App.Properties.getString('syncImagesWifiOnly',true);
	var syncVideoWifiOnly = Titanium.App.Properties.getString('syncVideoWifiOnly',true);
	var noBackgroundSync = Titanium.App.Properties.getString('noBackgroundSync',false);

	var tableView = Ti.UI.createTableView({
		backgroundColor: 'white',
		minRowHeight: 65,
		top:44
	});
	
	self.add(tableView);
	
	//var user = parseapi.PFUserCurrentUser(); //todo

	addPreference({
		self:self,
		id:'a1',
		header:'Account',
		table: tableView,
		title: 'Logout',
		description: Name,
		button: 'Logout',
		onclick: function(newValue) {
			//alert('logout now and close app');
			Titanium.App.Properties.setString('loggedIn',false);
			
			Cloud.Users.logout(function (e) {
				if (e.success) {
					self.fireEvent('loggedOut',user);
					self.close();
				} else {
					alert('Error:\\n' +
						((e.error && e.message) || JSON.stringify(e)));
				}
			});
			
			
			
		}
	});
	
	addPreference({
	self:self,
	id:'a2',
	table: tableView,
	title: 'Update Name',
	description: Name,
	onclick: function() {
			var opts = {'tfLabel':'Change your Name here.','tfValue':'Name','updateID':'a2','winTitle':'Update Name'};
			//TODO update name in cloud //only do below if network
			textSettingWindow(opts, self);
		}
	});
	
	addPreference({
		self:self,
		id:'s1',
		header:'Security',
		table: tableView,
		title: 'Use Pin Code',
		description: 'Protect your snaps from spies.',
		checked: usePinCode,
		onchange: function(newValue) {
			//
			if(newValue==true)
			{
				var opts = {'tfLabel':'Choose your Pin Code.','tfValue':'pinCode','updateID':false,'winTitle':'Pin Code'};
				textSettingWindow(opts, self);
			}
			Titanium.App.Properties.setString("usePinCode",newValue);
		}
	});
	
	addPreference({
		self:self,
		id:'p1',
		header:'Demonstration only',
		table: tableView,
		title:'Select Something',
		myitems: ['Item A', 'Item B', 'Item C'],
     	prefix:' ',
		selectedItem: testPref,
		onselect: function(newValue) {
			Titanium.App.Properties.setString("testPref",newValue);
		}
	});
	
	addPreference({
		self:self,
		id:'s1',
		header:'Sync Preferences',
		table: tableView,
		title: 'Sync Text',
		description: 'Wifi Only',
		checked: syncTextWifiOnly,
		onchange: function(newValue) {
			Titanium.App.Properties.setString("syncTextWifiOnly",newValue);
		}
	});
	
	addPreference({
		self:self,
		id:'s2',
		table: tableView,
		title: 'Sync Images',
		description: 'Wifi Only (Recommended)',
		checked: syncImagesWifiOnly,
		onchange: function(newValue) {
			Titanium.App.Properties.setString("syncImagesWifiOnly",newValue);
		}
	});
	
	addPreference({
		self:self,
		id:'s3',
		table: tableView,
		title: 'Sync Video',
		description: 'Wifi Only (Recommended)',
		checked: syncVideoWifiOnly,
		onchange: function(newValue) {
			Titanium.App.Properties.setString("syncVideoWifiOnly",newValue);
		}
	});
	
	addPreference({
		self:self,
		id:'s4',
		table: tableView,
		title: 'No Background Sync',
		description: 'Will only sync when asked. Above Settings respected.',
		checked: noBackgroundSync,
		onchange: function(newValue) {
			Titanium.App.Properties.setString("noBackgroundSync",newValue);
		}
	});
	
	//----------------------------------Info Section
	
	addPreference({
		self:self,
		id:'i1',
		table: tableView,
		header: 'Info',
		title: 'About',
		description: 'Day Snapper is a way to keep track of your day. It has been developed by Tiny.coop as something that will support future projects such as TribeTree.org and DooBee.org',
		onclick: function() {
			var textWin = Titanium.UI.createWindow({
				modal:true,
				backgroundColor:'#fff',
				borderWidth:8,
				borderColor:'#999',
				height:400,
				width:300,
				borderRadius:10
			});

			 var label = Ti.UI.createLabel({
				top: 5, left: 10, right: 10, height:40,
				text : "Lots of stuff about the Tiny.coop here.",
				color: 'black'
			});
			textWin.add(label);
	
			textWin.open({animated:true});
		}
	});
	
	addPreference({
		self:self,
		id:'i2',
		table: tableView,
		title: 'Changelog',
		description: 'New Features and bug fixes information can be found here.',
		onclick: function() {
		 var dialog = Ti.UI.createAlertDialog({
			message: 'Login system working.\nUsing Taffydb to store json locally.',
			ok: 'Okay',
			title: 'Changelog'
		  }).show();
		}
	});
	
	addPreference({
		self:self,
		id:'i3',
		table: tableView,
		title: 'Roadmap',
		description: 'What\'s being planned.',
		onclick: function() {
		 var dialog = Ti.UI.createAlertDialog({
			message: roadmap,
			ok: 'Okay',
			title: 'Roadmap'
		  }).show();
		}
	});
	
	addPreference({
		self:self,
		id:'i4',
		table: tableView,
		title: 'Build',
		description: 'Version ' + Ti.App.version
	});
	
	return self;
}

module.exports = settingsWindow;