function MasterView() {
	
	Ti.include('/lib/ti/global.js');
	
	var ActionBarView = require('/ui/common/shared/ActionBarView');
	
	var self = new ui.View({
		backgroundColor:'white'
	});
	
	//REFACTOR change this to reference snapstableview update everywhere
	var SnapView = require('/ui/common/snapsView/SnapsScrollableTableView');
	
	var snapsTable = new SnapView();
	
	//self.SnapView = snapsTable;
	
	self.add(snapsTable);
	
	var topBar = new ActionBarView({
		pos: 'top',
		buttons: {
			btnSettings: {
				icon:'gear',
				width:40
			}
		}
	});

	self.add(topBar.viewProxy);
	
	topBar.addEventListener('buttonPress', function(e) {
		//var btnAction = e.id; (only one option)
		//open settings window
		var url = '/ui/common/settings/btnSettingsWindow';
		var masterModal = require(url);
		var w = new masterModal();
		
		w.addEventListener('loggedOut', function(user) {
			self.fireEvent('unauthenticated',user)
			return false;
		});
			
		w.open();
	});
	
	topBar.addEventListener('close', function() {
		self.close();
	});
	
	var bottomBar = new ActionBarView({
		pos: 'bottom',
		buttons: {
			btnAdd: {
				icon:'plus',
				width:80
			},
			btnSync: {
				icon:'sync',
				width:80
			},
			btnTags: {
				icon:'tag',
				width:80
			},
			btnSearch: {
				icon:'search',
				width:80
			}
		}
	});

	self.add(bottomBar.viewProxy);
	
	bottomBar.addEventListener('buttonPress', function(e) {

		var btnAction = e.id;
		if(btnAction == 'btnSearch')
		{
			snapsTable.fireEvent('doSearch');
		}
		else if(btnAction == 'btnSync')
		{
			snapsTable.fireEvent('doSync');
		}
		else
		{
			//btnAction == 'btnTags' or btnAction == 'btnAdd'
			var url = (btnAction == 'btnAdd') ? '/ui/common/snapCrud/btnAddWindow' : '/ui/common/snapsView/btnTagsWindow';
			var masterModal = require(url);
			var w = masterModal();
			w.addEventListener('saveSnap_passBack_step3', function(newSnap) {
				Ti.API.info('------------off to save new snap stage 4---------------');
				snapsTable.fireEvent('saveSnap_taffySave_step4',newSnap); // SnapScrollableTableView.js still just passing newsnap
			});
			w.open();
		}
		
		

	});
	
	return self;
};

module.exports = MasterView;