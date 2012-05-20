function SnapView() {
	
	Ti.include('/lib/ti/global.js');

	var cloudSync = require('/lib/ti/cloudSync');
	var taffySync = require('/lib/ti/taffySync');
	
	
	var self = Ti.UI.createView({
		backgroundColor:'#FFFFFF',
		top:44,
		height:375
	});
	
	
	var snapTable = Ti.UI.createTableView({
		height:375,
		color:'#999'
	});
	
	self.add(snapTable);
	
	//taffySync.cleanTaffy();
	//Titanium.App.Properties.setString('lastTextSyncDate',"false");
	
	var autoSync = Titanium.App.Properties.getString('autoSync', "false");
	if(autoSync)
	{
		var autoSync = require('/lib/ti/autoSync').autoSync();
	}
	else
	{
		Ti.App.fireEvent('loadTable');
	}
	
	
	
	Ti.App.addEventListener('taffySync.updateTaffy', function(jsonData, callback) {

		taffySync.updateTaffyV2(jsonData.uid, jsonData, callback);
	});
	

	//sets table data on app open
	self.addEventListener('setTableData', function(myArrayData) {

		Ti.API.info('data for table '+ JSON.stringify(myArrayData));
		snapTable.data = myArrayData;	
	});

	Ti.App.addEventListener('loadTable', function() {

		taffySync.loadTable(self);
	});

	//sends all table row data (should be whole taffy row record) to new detail window
	snapTable.addEventListener('click', function(e) {

		e.rowData.tableRow = e.index;
		Ti.API.info('----------- adding this on click  '+JSON.stringify(e.rowData));
		//self.fireEvent('itemSelected', {snap:e.rowData});
		//return false;
		var args = {data:e.rowData,win:self};
		var masterModal = require('/ui/common/snapsView/detailWindow');
		var w = masterModal(args);
		w.open();
		
	});
	

	//new snap is inserted into local taffyDB
	self.addEventListener('saveSnap_taffySave_step4', function(newSnap) {

		var d1 = new Date().toISOString();
		var defaults = {"status":"live","isPrivate":true,"isSynced":false,"lastSyncDate":false,"post_id":false,
						"dateCreated":d1,"dateUpdated":d1,"userID":userID};
		_.extend(newSnap, defaults);
		//var myTaffyDB = self.myTaffyDB;
		var callback = {win:self, func:'saveSnap_insertTableRowSaveToCloud_step5'};
		//taffySync.insertTaffy(newSnap, callback); //when inserted in TaffyDB table update and cloud sync called below
		taffySync.insertTaffy(newSnap, callback);
	});
	
	
	//new snap with taffyID is inserted as new row in tableview and attempt to sync row to cloud
	self.addEventListener('saveSnap_insertTableRowSaveToCloud_step5', function(newRow) {

		snapTable.insertRowBefore(0, newRow);
		var taffyID = newRow.uid;
		Ti.API.info('------------stage 5: tableRowInserted now SaveToCloud then update taffyID ' + taffyID);
		cloudSync.insertSnap(newRow, self, taffyID, 0); //new so row is 0
	});
	
	
	//used as the callback when data is saved in the cloud and a cloudID, syncUpdateDate generated
	self.addEventListener('saveSnap_taffyUpdate_step6', function(updatedSnap) {
		
		Ti.API.info('updated row for TaffyDB and Table '+JSON.stringify(updatedSnap));
		var taffyID = updatedSnap.keys.taffyID;
		var tableRow = updatedSnap.keys.tableRow;
		delete(updatedSnap.keys);
		var cloudUpdate = {post_id:updatedSnap.post_id,updatedDate:updatedSnap.post_id,isSynced:updatedSnap.isSynced,lastSynced:updatedSnap.lastSynced}
		//Ti.API.info('recheck updatedsnaps'+JSON.stringify(updatedSnap));
		var tableRefresh = (updatedSnap.status == 'live') ? true : false;
		if(tableRefresh)
		{
			snapTable.updateRow(tableRow, updatedSnap); //update table row
		}
		taffySync.updateTaffy(taffyID, cloudUpdate);
	});

	
	//update taffyDB and table row then callback for cloudInsert
	self.addEventListener('updateSnap_updateTableRowUpdateTaffy_step2', function(myJsonData) {
		
		Ti.API.info(JSON.stringify(myJsonData));
		Ti.API.info('------------updateSnap_updateTableRowUpdateTaffy_step2');
		var d1 = new Date().toISOString();
		var defaults = {"dateUpdated":d1,"isSynced":false,"lastSyncDate":false};
		var updatedSnap = myJsonData.updatedSnap;
		_.extend(updatedSnap, defaults);

		setTimeout(function(){
			Ti.API.info(JSON.stringify('taffyID row to update '+myJsonData.updatedSnap.uid))
			taffySync.loadTable(self); // lazy hide a row if archive/delete update a row if edit put the flag in e
		},500);

		var callback = {win:self, func:'updateSnap_SaveToCloud_step3', tableRow:myJsonData.tableRow};
		taffySync.updateTaffy(updatedSnap.uid, updatedSnap, callback);
	});
	
	
	//callback from updated Taffy Row update row in tableview and attempt to sync row to cloud
	self.addEventListener('updateSnap_SaveToCloud_step3', function(myJsonData) {

		Ti.API.info('-------updateSnap_SaveToCloud_step3 '+JSON.stringify(myJsonData));
		//Ti.API.info(JSON.stringify(e));
		var taffyID = myJsonData.taffyID;
		var updatedSnap = myJsonData.updatedSnap;
		var tableRow = myJsonData.tableRow
		
		//even though updated could be first time synced // callback is saveSnap_taffyUpdate_step6 same as insert
		cloudSync.insertSnap(updatedSnap, self, taffyID, tableRow); 
	});
	
	
	self.addEventListener('setTableData2', function() {
		var y = taffySync.getTaffy('all_live');
		snapTable.data = y;
	});
	
	
	self.addEventListener('doSearch', function() {
			alert('search coming soon..');
	});
	



	
	return self;
};

module.exports = SnapView;