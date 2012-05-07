Ti.include('/lib/ti/global.js');	
//Ti.include('/lib/thirdParty/ti.taffydb.js');	
Ti.taffy = require('/lib/thirdParty/ti.taffydb').taffyDb;

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

exports.getTaffyFromFile = function(which) {
	
		var myTaffyDB = Ti.taffy ([]);
		if(which=='latest')
		{
			myTaffyDB.open('latest');
			//is there a way to make this more efficient using Ti.APP.Properties ?
			//var myTaffyDB = TAFFY( TAFFY.loadFlatFile('snapsLatest.json') );
		}
		else
		{
			//dont use this ?
			var year_month = which;
			var myTaffyDB = TAFFY( TAFFY.loadFlatFile('snaps'+year_month+'.json') );
		}
		
		
		
		
						myTaffyDB.settings({onUpdate:function () {
				 
							 alert('this worked');
								  
								 
						}});
						
		
		
		
		
		//Ti.API.info('-----------------get whats in myTaffyDB from file '+JSON.stringify(myTaffyDB().stringify()));
		return myTaffyDB;
}



exports.createTaffy = function(jsonData) {
	
		var myTaffyDB = TAFFY(jsonData);
		this.saveTaffyToFile(myTaffyDB);
		Ti.API.info('-------------------Create TaffyDB from JSON');
		return myTaffyDB
}

exports.saveTaffyToFile = function(myTaffyDB) {

		myTaffyDB().callback(function () {
			
			Ti.API.info('-------------------Saved to file: see below (off)'); 
			//Ti.API.info(JSON.stringify(myTaffyDB().stringify()));

			myTaffyDB.saveFlatFile('snapsLatest.json');
			        
		});
}

exports.cleanTaffy = function() {
	
		var myTaffyDB = exports.getTaffyFromFile('latest');
		myTaffyDB().callback(function () {
			
		   myTaffyDB.settings({onRemove:function () {
					alert(this);
					Ti.API.info('----------all data removed from TaffyDB');  
					exports.saveTaffyToFile(myTaffyDB);  
			}});
			
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
							win.fireEvent(callback.func, this);
					  }
					  else
					  {
					  		return this; 
					  }
				 }});
				 
			 myTaffyDB.insert(jsonData); 
			         
		});
}

exports.updateTaffy = function(taffyID, jsonData, callback) {
	
		//var myTaffyDB = exports.getTaffyFromFile('latest');
		
		Ti.API.info('------------doing updateTaffy ..');

		
		myTaffyDB().callback(function () {
			
			myTaffyDB.settings({onUpdate:function () {
					 
					// alert(e);
					  
					  Ti.API.info('onUpdate ------------whats TaffyID '+ taffyID);
					  Ti.API.info('onUpdate ------------whats update data '+ JSON.stringify(this));
					  exports.saveTaffyToFile(myTaffyDB);	
					  
					  if(callback)
					  {
							Ti.API.info('------------reached here ready for callback');
							var win = callback.win;
							var func = callback.func;
							var jsonData = {taffyID:taffyID,updatedSnap:jsonData,tableRow:callback.tableRow};
							win.fireEvent(callback.func, jsonData);
					  }
					  else
					  {
							return myTaffyDB; 
					  }  
			}});

			
			
			Ti.API.info('------------whats TaffyID '+ taffyID);
			Ti.API.info('------------whats update data '+ JSON.stringify(jsonData));
			
			var row = myTaffyDB().get();
			for (var i = 0; i < row.length; i++) {
				  alert(row[i]['___id']);
				  //Do something
			  }
			
			//myTaffyDB().update(jsonData);
			//myTaffyDB(taffyID).update(jsonData); 
			return false;
		});
		return false;
}


exports.updateTaffyCloudID = function(taffyID, cloudID, win) {

		var myTaffyDB = this.getTaffyFromFile('latest');
		
		myTaffyDB().callback(function () {
			myTaffyDB.settings({onUpdate:function () {
				
					Ti.API.info('------------whats TaffyID '+ taffyID);
					Ti.API.info('------------whats cloudID '+ cloudID);
					exports.saveTaffyToFile(myTaffyDB);
 
					if(callback)
					{
						  var win = callback.win;
						  var func = callback.func;
						  win.fireEvent(callback.func, this);
					}
					else
					{
						  return myTaffyDB; 
					}
				}});
			
			myTaffyDB(taffyID).update({"post_id":cloudID});
		});
}


exports.doSync = function() {
	
}

exports.loadTable = function(win) {

		//exports.cleanTaffy();
		Titanium.App.Properties.setString('isFirstTime',"false");
		var isFirstTime =  Titanium.App.Properties.getString('isFirstTime',"true");
		var myTaffyDB = (isFirstTime!=="true") ? exports.getTaffyFromFile('latest') : exports.prepopulateTaffy();

		myTaffyDB().callback(function () {
			Titanium.App.Properties.setString('isFirstTime',false);
			var myArrayData = exports.getTaffy('all_live', myTaffyDB);
			win.fireEvent('setTableData', myArrayData);

		});
		
}

exports.prepopulateTaffy = function() {

		//check no rows in taffydb?
		Ti.API.info('------------First Time Set Welcome Data--------------------');
		var d1 = new Date().toISOString();
		var rightImage = iconPath('note','bottom');
		var defaultsDD = {"dateCreated":d1, "dateUpdated":d1, "dateFor":d1, "status":"live", "userID":userID, "rightImage":rightImage, "category":"note", "isSynced":false};
		var r1 = {"title":"Welcome to Day Snapper.","content":"Here are a few tips to get you started","tags_array":"cool, beans"};
		var r2 = {"title":"A short note about Tiny.coop.","content":"Tiny is a web coop. Owned and run by its users."};
		_.extend(r1, defaultsDD);
		_.extend(r2, defaultsDD);
		var myJsonData = [r1,r2];
		myTaffyDB = exports.createTaffy(myJsonData);
		
		myTaffyDB().callback(function () {
			Ti.API.info('------------reached here 196');
			return myTaffyDB;

		});

}