//Ti.include('/lib/ti/global.js');	
Ti.include('/lib/thirdParty/taffy.js');	
//Taffy = require('/lib/thirdParty/ti.taffydb').taffyDb;

exports.getTaffy = function(args, taffyDB) {

		var which = (args.constructor == Array) ? args.which : args; // allows to load opts in args for more sophisticated queries
		
		if(which=='default_view')
		{
			which = Titanium.App.Properties.getString('default_view','all_live')
		}
		
		if(which=='all_live')
		{
			//all types that are status live
			var myArrayData = taffyDB({status:"live"}).order("dateFor desc").get();
		}
		else if(which=='all_archived')
		{
			//all types that are any status
			var myArrayData = taffyDB({status:"archive"}).order("dateFor desc").get();
		}
		else if(which=='all_all')
		{
			//all types that are any status
			var myArrayData = taffyDB().order("dateFor desc").get();
		}
		Ti.API.info('-------------------- loading all '+which+' snaps '+JSON.stringify(myArrayData));

		return myArrayData
}


exports.getTaffyLoad = function(which) {
	
		//Titanium.App.Properties.setString('isFirstTime',"false");
		var isFirstTime = Titanium.App.Properties.getString('isFirstTime',"true");

		if(isFirstTime==="true")
		{
			var myTaffyDB = exports.prepopulateTaffy(myTaffyDB);
		}
		else
		{
			Titanium.App.Properties.setString('isFirstTime',"false");
			var myTaffyDB = exports.getTaffyFromFile(myTaffyDB);
		}
		return myTaffyDB;
}


exports.getTaffyFromFile = function(which) {
	
		//
		
		if(which=='latest')
		{
			//ar myTaffyDB = Ti.taffy();
			//myTaffyDB = Taffy().open('latest');
			//is there a way to make this more efficient using Ti.APP.Properties ?
			var myTaffyDB = TAFFY( TAFFY.loadFlatFile('snapsLatest.json') );
		}
		else
		{
			//dont use this ?
			var year_month = which;
			//myTaffyDB.open(year_month);
			var myTaffyDB = TAFFY( TAFFY.loadFlatFile('snaps'+year_month+'.json') );
		}
		
		Ti.API.info('-----------------get whats in myTaffyDB from file '+JSON.stringify(myTaffyDB().stringify()));
		return myTaffyDB;
}



exports.createTaffy = function(jsonData) {
	
		var myTaffyDB =  Ti.taffy(jsonData);
		exports.saveTaffyToFile(myTaffyDB);
		Ti.API.info('-------------------Create TaffyDB from JSON');
		return myTaffyDB
}

exports.saveTaffyToFile = function(myTaffyDB) {

		Ti.API.info('-------------------Saved to file: see below (not off)'); 
		Ti.API.info(JSON.stringify(myTaffyDB().stringify()));
		//myTaffyDB = Taffy().save('latest');
		myTaffyDB = myTaffyDB.saveFlatFile('snapsLatest.json');
		
		return myTaffyDB;
}

exports.cleanTaffy = function() {
	
		var myTaffyDB = exports.getTaffyFromFile('latest');
		myTaffyDB().callback(function () {
			
	   myTaffyDB.settings({onRemove:function () {
					//alert(this);
					Ti.API.info('----------all data removed from TaffyDB');  
					exports.saveTaffyToFile(myTaffyDB);  
			}});
			
			Ti.API.info(JSON.stringify(myTaffyDB().stringify()));
			 myTaffyDB().remove();
			 return false;     
		});
		return false;
}

exports.countTaffy = function(myTaffyDB) {
	
		//var myTaffyDB = TAFFY( TAFFY.loadFlatFile('snapsLatest.json') );
		myTaffyDB().callback(function () {
			var c = this.count();
			Ti.API.info('------------count:'+ c);
			return c;           
		});
}

exports.insertTaffy = function(jsonData, callback) {
	
		var myTaffyDB = exports.getTaffyFromFile('latest');

		myTaffyDB().callback(function () {
			
			myTaffyDB.settings({onInsert:function () {

					  Ti.API.info('-----TaffyDB inserted row ----- '+JSON.stringify(this)); 
					  exports.saveTaffyToFile(myTaffyDB);
					  if(callback)
					  {
					  		var win = callback.win;
							var func = callback.func;
							Ti.API.info('------------ callback ' + win);
							//retVal = {newSnap,myTaffyDB}
							win.fireEvent(callback.func, this);
					  }
					  else
					  {
					  		return this; 
					  }
				 }});
			 
			 var d = new Date();
			 var n = d.getTime();
			 jsonData.uid = n;
			 myTaffyDB.insert(jsonData); 
			         
		});
}

exports.updateTaffy = function(taffyID, myJsonData, callback) {
	
		var myTaffyDB = exports.getTaffyFromFile('latest');
		
		Ti.API.info('pre ------------whats update data '+ JSON.stringify(myJsonData));
		
		Ti.API.info('pre ------------whats TaffyID '+ taffyID);

		myTaffyDB().callback(function () {
			
			Ti.API.info('pre ------------whats update data '+ JSON.stringify(myJsonData));
			
			//var test1 = JSON.stringify(myJsonData);
			//var test2 = 'test;' 
			var retJsonData = myJsonData;
			
			Ti.API.info('------------doing callback update Taffy ..');
			
			myTaffyDB.settings({onUpdate:function () {
				
					Ti.API.info('pre ------------whats update data '+ JSON.stringify(retJsonData));

					  Ti.API.info('onUpdate ------------whats TaffyID '+ taffyID);
					  Ti.API.info('onUpdate ------------whats update data '+ JSON.stringify(retJsonData));
					  Ti.API.info('--should have been updated---'+JSON.stringify(myTaffyDB().stringify()));
					  
					  if(callback)
					  {
							Ti.API.info('------------reached here ready for callback');
							var win = callback.win;
							var func = callback.func;
							var retExtJsonData = {taffyID:taffyID,updatedSnap:retJsonData,tableRow:callback.tableRow};
							win.fireEvent(callback.func, retExtJsonData);
					  }
					  else
					  {
							return myTaffyDB; 
					  }  
			}});
			
			
			 myTaffyDB({'uid':taffyID}).update(myJsonData); 
			 
			 Ti.API.info('cehecking here for update '+JSON.stringify(myTaffyDB().stringify()));
			 
			 exports.saveTaffyToFile(myTaffyDB);
			//Ti.API.info('query object '+JSON.stringify(x().stringy()));
			return false;
		});
		return false;
}



exports.doSync = function() {
	
}



exports.loadTable = function(win ) {

		Ti.API.info('------------reload table');
		var myTaffyDB = exports.getTaffyFromFile('latest');
		
		myTaffyDB().callback(function () {
			
			var myArrayData = exports.getTaffy('all_live', myTaffyDB);
			win.fireEvent('setTableData', myArrayData);

		});
}

exports.prepopulateTaffy = function() {

		//check no rows in taffydb?
		Ti.API.info('------------First Time Set Welcome Data--------------------');
		var d = new Date();
		var d1 = new Date().toISOString();
		var d2 = d.getTime();
		var d3 = d2+1;
		var rightImage = iconPath('note','bottom');
		var defaultsDD = {"dateCreated":d1, "dateUpdated":d1, "dateFor":d1, "status":"live", "userID":userID, "rightImage":rightImage, "category":"note", 
		"isSynced":false, "lastSyncDate":false};
		var r1 = {"title":"Welcome to Day Snapper.","content":"Here are a few tips to get you started","tags_array":"cool, beans","uid":d2};
		var r2 = {"title":"A short note about Tiny.coop.","content":"Tiny is a web coop. Owned and run by its users.","uid":d3};
		_.extend(r1, defaultsDD);
		_.extend(r2, defaultsDD);
		var myJsonData = [r1,r2];
		
		myTaffyDB = exports.createTaffy(myJsonData);
		
		myTaffyDB().callback(function () {

			return myTaffyDB;

		});

}