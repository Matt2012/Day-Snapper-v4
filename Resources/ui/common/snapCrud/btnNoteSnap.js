function doSnap() {

	Ti.include('/lib/ti/global.js');
	var ActionBarView = require('/ui/common/shared/ActionBarView');
	
	var self = new ui.Window({
		backgroundColor:'white',
		modal:true,
		navBarHidden:true
	});
	
	var topBar = new ActionBarView({
		type:'Quick Note Snap',
		pos: 'top'
	});
	
	topBar.addEventListener('close', function() {
		self.close();
	});

	self.add(topBar.viewProxy);
	
	var qnLabel = Titanium.UI.createLabel({
		font:{fontSize:14},
		text:'Add your note..',
		left:10,
		top:70,
		width:300,
		height:'auto'
	});
	self.add(qnLabel);


	var qnText = Titanium.UI.createTextArea({
		editable: true,
		height:120,
		width:300,
		top:100,
		font:{fontSize:18,fontFamily:'Marker Felt'},
		color:'#888',
		textAlign:'left'
		
	});
	self.add(qnText);
	
	var qnButton = Titanium.UI.createButton({
		title:'Save',
		height:40,
		width:300,
		top:220
	});
	self.add(qnButton);
	qnButton.addEventListener('click', function()
	{
		var textSnap = qnText.value;
		if(textSnap=='')
		{
			alert('Note snap can not be empty');
		}
		else
		{
			var icon = iconPath('note','bottom');
			var newSnap = {'title':textSnap,'category':'note','rightImage':icon};
			self.fireEvent('saveSnapAndRefresh_step1', newSnap);
			self.close();
		}

	});
	
	qnText.focus();
	return self;
}

module.exports = doSnap;