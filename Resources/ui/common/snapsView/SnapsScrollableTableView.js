function SnapView() {
	
	Ti.include('/lib/ti/global.js');
	
	//should all this be refactored to the form view that is the only time it is needed??	
	Ti.include('/lib/thirdParty/taffy.js');	
	var cloudSync = require('/lib/ti/cloudSync');
	//var atlas = require('lib/ti/atlas/atlas');
	
	var self = Ti.UI.createView({
		backgroundColor:'#FFFFFF',
		top:44,
		height:375
	});
	
	//var user = Titanium.App.Properties.getList(Titanium.App.Properties.getString('userID'));

	var mySnapsDB = TAFFY( TAFFY.loadFlatFile('snapsLatest.json') );
	
	
	
	mySnapsDB().remove();
	
	var c = mySnapsDB().count();
	
	Ti.API.info('-----------------------------------------------------count:'+ c);
	//if first time
	if (c<1 || !c) {		
		//some dummy data if empty
		var d1 = new Date().toISOString();
		var rightImage = iconPath('note','bottom');
		// user.objectForKey("username")
		//Ti.API.info('atlas=' + altas);
		//var coordinates = [];
		var defaultsDD = {"dateAdded":d1, "dateUpdated":d1, "dateFor":d1, "status":"live", "hasChild":true, 
		"userID":userID,"rightImage":rightImage,"category":"note","objectId":false,"isOnline":false};
		var r1 = {"title":"Welcome to Day Snapper.","content":"Here are a few tips to get you started","tags_array":"cool, beans"};
		var r2 = {"title":"A short note about Tiny.coop.","content":"Tiny is a web coop. Owned and run by its users."};
		_.extend(r1, defaultsDD);
		_.extend(r2, defaultsDD);
		var ar = [r1,r2];
		var snaps = TAFFY ( ar );
	    snaps.saveFlatFile('snapsLatest.json');
	    Ti.API.info('fresh');
	}
	else
	{
		Ti.API.info('not fresh');
		mySnapsDB.saveFlatFile('snapsLatest.json');
	}
	var mySnapsDB = TAFFY( TAFFY.loadFlatFile('snapsLatest.json') );
	
	var y = mySnapsDB({status:"live"}).order("dateFor desc").get();
	//var y = mySnapsDB().get();
		
	var snapTable = Ti.UI.createTableView({
		data:y,
		height:375,
		color:'#999'
	});
	self.add(snapTable);
	
	//add behavior
	snapTable.addEventListener('click', function(e) {
		//alert(e.rowData.title);
		Ti.API.info('adding this on click ----------------- '+JSON.stringify(e.rowData));
		self.fireEvent('itemSelected', {snap:e.rowData});
		return false;
	});
	
	
	self.addEventListener('saveSnapAndRefresh_step4', function(newSnap) {
		var mySnapsDB = TAFFY( TAFFY.loadFlatFile('snapsLatest.json') );
		var d1 = new Date().toISOString();
		var defaults = {"status":"live","isPrivate":true,"isSynced":false,"post_id":false,
						"dateCreated":d1,"dateUpdated":d1,"userID":userID};
		_.extend(newSnap, defaults);
		var newRow = mySnapsDB.insert(newSnap).get();
		Ti.API.info("---------------------------Taffy Insert New Row! "+JSON.stringify(newRow));
		//Ti.API.info("---------------------------Taffy Insert New Row! "+newRow[0]["userID"]+' '+newRow[0]["___id"]);
		mySnapsDB.saveFlatFile('snapsLatest.json');
		var y = mySnapsDB({status:"live"}).order("dateFor desc").get();
		//Ti.API.info('new table data '+JSON.stringify(y));
		snapTable.data = y;
		//run sync routine - insert row
		var taffyID = newRow[0]["___id"];
		Ti.API.info('------------reached taffyID ' + taffyID);
		cloudSync.insertSnap(newSnap, self, taffyID);
		return false;
	});
	
	self.addEventListener('saveSnapAndRefresh_step5', function(newSnap, taffyID) {
		var z = mySnapsDB(taffyID).update(newSnap).get();
		snapTable.updateRow(0,newSnap);
		return false;
	});
	
	
	self.addEventListener('modifySnapAndRefresh_step2', function(e) {
		Ti.API.info('------------modifySnapAndRefresh_step2');
		var d1 = new Date().toISOString();
		var defaults = {"dateUpdated":d1,"isSynced":false};
		var updatedSnap = e.updatedSnap;
		_.extend(updatedSnap, defaults);
		//Ti.API.info('data passed on for modify '+JSON.stringify(e));
		var updateRow = mySnapsDB(e.id).update(updatedSnap).get();
		mySnapsDB.saveFlatFile('snapsLatest.json');
		var y = mySnapsDB({status:"live"}).order("dateFor desc").get();
		snapTable.data = y;
		//run sync routine - insert or update row
		Ti.API.info('-------whats to be updated '+JSON.stringify(updatedSnap));
		Ti.API.info(JSON.stringify(e));
		taffyID = e.id;
		cloudSync.insertSnap(updatedSnap, self, taffyID); //even though updated could be first time synced
		return false;
	});
	
	
	
	self.addEventListener('doSync', function() {
		var refreshTable = cloudSync.doSync();	
		if(refreshTable)
		{
			//var mySnapsDB = TAFFY( TAFFY.loadFlatFile('snapsLatest.json') );
			var y = mySnapsDB({status:"live"}).order("dateFor desc").get();
			snapTable.data = y;
		}
	});
	
	
	self.addEventListener('doSearch', function() {
			alert('search coming soon..');
	});
	
	return self;
};

module.exports = SnapView;