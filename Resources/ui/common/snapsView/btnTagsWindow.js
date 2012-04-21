function btnTagsWindow() {

	Ti.include('/lib/ti/global.js');
	Ti.include('/ui/common/snapCrud/selectorActions.js');
	var ActionBarView = require('/ui/common/shared/ActionBarView');
	
	var self = new ui.Window({
		backgroundColor:'white',
		modal:true,
		navBarHidden:true
	});
	
	var TagSelectorScrollableTableView = require('/ui/common/snapsView/TagSelectorScrollableTableView');
	
	var TSSTableView = new TagSelectorScrollableTableView();
	
	self.SnapView = TSSTableView;
	
	self.add(TSSTableView);
	
	self.SnapView.addEventListener('itemSelected', function(e) {
		doAction('Tags', e.id);
	});
	
	var topBar = new ActionBarView({
		type:'View by Tags',
		pos: 'top'
	});

	self.add(topBar.viewProxy);
	
	topBar.addEventListener('buttonPress', function(e) {
		alert(e.id);
		//open settings window
	});
	
	var bottomBar = new ActionBarView({
		pos: 'bottom',
		buttons: {
			btnAdd: {
				icon:'plus',
				width:160
			},
			btnEdit: {
				icon:'edit',
				width:160
			}
		}
	});

	self.add(bottomBar.viewProxy);
	
	bottomBar.addEventListener('buttonPress', function(e) {
		doAction('TagOpts',e.id);
	});

	return self;
}

module.exports = btnTagsWindow;