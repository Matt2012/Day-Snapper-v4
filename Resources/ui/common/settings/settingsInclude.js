// JavaScript Document

function textSettingWindow(opts, self)
{
	var ActionBarView = require('/ui/common/shared/ActionBarView');
	
	var textWin = Titanium.UI.createWindow({
		modal:true,
		navBarHidden:true,
		backgroundColor:'#fff'
	});
	
	var topBar = new ActionBarView({
		type:opts.winTitle,
		pos: 'top'
	});

	textWin.add(topBar.viewProxy);

	 var label = Ti.UI.createLabel({
		top: 55, left: 10, right: 10, height:40,
		text : opts.tfLabel,
		color: 'black'
	});
	textWin.add(label);

	var tf1 = Ti.UI.createTextField({
		value: Titanium.App.Properties.getString(opts.tfValue, ''),
		keyboardType:Ti.UI.KEYBOARD_NUMBER_PAD,
		top: 100, left: 10, right: 10, height:40
	});
	textWin.add(tf1);

	var btn = Ti.UI.createButton({
		title: 'Close',
		top: 150, left: 10, right: 10, height:40
	});

	btn.addEventListener("click", function(e) {
		if(opts.updateID)
		{
			self.myDesc[ opts.updateID ].text = tf1.value;
		}
		Titanium.App.Properties.setString(opts.tfValue, tf1.value);
		textWin.close();
	});
	textWin.add(btn);

	textWin.open({animated:true});
}

//Pull this in from cloud based on version number stored in keypairs
var roadmap = [ 'To Do',
				'',
				'Add all this to Road Plan in app. ',
				'',
				'Stage 1: Early Alpha: Share with Greg Apri',
				'',				
				'Edit, Delete, Sync ',		
				'',
				'Add',
				'',				
				'Geolocation, Add Camera Snap, Video Snap, Audio Snap, Gallery Snap   ',	
				'',
				'Stage 2: Actual Alpha: Share with Greg: May 1st',
				'',				
				'Add tags ',	
				'',
				'Change Date / Geolocation ',
				'',				
				'Archive, Sort, Tag Search, Date Search',	
				'',				
				'Doo Bee Snap',				
				'',				
				'',
				'Stage 3: Beta 1: Share with User Group Greg / Tinge / Nadia / Simon / Dom*3: Mid May',				
				'',	
				'Early iPhone and iPad version ',				
				'',				
				'Text Search Blog Snap (first integration e.g. Blogger.com)',				
				'',
				'Share on Facebook / Twitter ',				
				'',	
				'Stage 4: Beta 2: Share with User Group Greg / Tinge / Nadia / Simon / Dom*3: June 1st ',				
				'',				
				'Friend Feeds, Public Tag Feeds',				
				'Map View, Gallery View ',														
				''].join('\n');
				