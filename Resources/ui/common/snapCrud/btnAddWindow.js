function btnAddWindow() {

	Ti.include('/lib/ti/global.js');
	Ti.include('/ui/common/snapCrud/selectorActions.js');
	var ActionBarView = require('/ui/common/shared/ActionBarView');
	
	var self = new ui.Window({
		backgroundColor:'white',
		modal:true,
		navBarHidden:true
	});
	
	var SnapSelectorScrollableTableView = require('/ui/common/snapCrud/SnapSelectorScrollableTableView');
	
	var SSSTableView = new SnapSelectorScrollableTableView();
	
	self.SnapView = SSSTableView;
	
	self.add(SSSTableView);
	
	self.SnapView.addEventListener('itemSelected', function(e) {
		doAction('Snap', e.id, self, e);
	});
	
	var topBar = new ActionBarView({
		type:'Pick a Snap',
		pos: 'top'
	});
	
	topBar.addEventListener('close', function() {
		self.close();
	});

	self.add(topBar.viewProxy);
	
	
	var bottomBar = new ActionBarView({
		pos: 'bottom',
		buttons: {
			btnNote: {
				icon:'note',
				width:80
			},
			btnCamera: {
				icon:'camera',
				width:80
			},
			btnVoice: {
				icon:'voice',
				width:80
			},
			btnVideo: {
				icon:'video',
				width:80
			}
		}
	});

	self.add(bottomBar.viewProxy);
	
	bottomBar.addEventListener('buttonPress', function(e) {
		doAction('Snap',e.id, self, e);
	});
	
	self.addEventListener('saveSnapAndRefresh_step2', function(newSnap) {
		self.fireEvent('saveSnapAndRefresh_step3',newSnap);
		//return false;
	});

	return self;
}

module.exports = btnAddWindow;