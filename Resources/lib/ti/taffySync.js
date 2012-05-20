var moment = require('/lib/thirdParty/moment.min');
Ti.include('/lib/ti/global.js');
Ti.include('/lib/thirdParty/taffy.js');	
//Ti.taffy = TAFFY = require('/lib/thirdParty/ti.taffydb').taffyDb;
Ti.taffy = TAFFY;
Ti.taffy.extend("upsert",function (primarykeys,records) {
	// get context
	var that = this;
	// run query as needed
	that.context({
		results: that.getDBI().query(that.context())
	});
	
	var foundRecords = {};
	
	TAFFY.each(this.context().results,function (r) {
		var k = "";
		TAFFY.each(primarykeys,function (key) {
			k = k +"_" + r[key];
			Ti.API.info('------------k '+k);
		})	
		Ti.API.info('------------taffyID '+r.___id);
		foundRecords[k] = r.___id;
	});
	
	//Ti.API.info(JSON.stringify(foundRecords[k]));
	
	var myTaffyDB = exports.getTaffyFromFile('latest');
	
	TAFFY.each(records,function (r) {
		var k = "";
		TAFFY.each(primarykeys,function (key) {
			k = k +"_" + r[key];
		})
		
		if (foundRecords[k]) {

			//_doUpdate(r, foundRecords[k])
			Ti.API.info('-------------------------------------------------------------going to do a local update');
			that.getDBI().update(foundRecords[k], r);
			//var x = TAFFY;
			/*setTimeout(function(){
				
			},0);*/
			//myTaffyDB({'post_id':r.post_id}).update(r); 
		
		} else {
			that.getDBI().insert(r);
		}
	});
	// since data may have changed, clear chache
	if (this.context().results.length) {
		this.context({
			run: null
		});
	}
	return this;
})

function _doUpdate(r, taffyID)
{
			//Ti.API.info('----new row to replace old '+JSON.stringify(r));
			
			//Ti.API.info('------------taffyID to update '+taffyID);
			
			var myTaffyDB = exports.getTaffyFromFile('latest');
			
			//Ti.API.info('------------reached here: '+r.post_id);
			
			
			myTaffyDB().callback(function () {
				
				Ti.API.info('-------------------------------------------------------------------reached here: '+r.post_id);
				Ti.API.info('is this undefined '+JSON.stringify(myTaffyDB().stringify()));	
				myTaffyDB({"post_id":r.post_id}).update(r); 
			
			 });
}


exports.getTaffy = function(args, taffyDB) {

		var taffyDB = (taffyDB) ? taffyDB : exports.getTaffyFromFile('latest');
		
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
		else if(which=='ready_to_delete')
		{
			//all types that are status deleted and updated more than a month ago
			var one_month_ago = moment().subtract('months', 1).format();
			var myArrayData = taffyDB({status:"deleted",updated_at:{lt:one_month_ago}}).get();
		}
		else if(which=='all_unsynced')
		{
			//types that do not have status deleted that are not synched
			var myArrayData = taffyDB({status:{"!is":"deleted"}},{isSynced:false}).get();
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
	
		myTaffyDB = Ti.taffy([]);
		
		if(which=='latest')
		{
			//var myTaffyDB = Ti.taffy();
			//myTaffyDB.open('snapsLatest.json');
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
		Ti.API.info('--->>' + JSON.stringify(myTaffyDB().stringify()));
		//myTaffyDB = Taffy().save('latest');
		//myTaffyDB.save('snapsLatest.json');
		myTaffyDB = myTaffyDB.saveFlatFile('snapsLatest.json');
		
		return;
}

exports.cleanDeletedTaffy = function() {
	
		var myTaffyDB = exports.getTaffyFromFile('latest');
		myTaffyDB().callback(function () {	
		
			 var myArrayData = exports.getTaffy('ready_to_delete', myTaffyDB);		
			 myTaffyDB.settings({onRemove:function () {
						  Ti.API.info('delete-- '+JSON.stringify(args));//alert(this);
						  Ti.API.info('----------1 month old data removed from TaffyDB');  
						  exports.saveTaffyToFile(myTaffyDB);
						  //Ti.API.info(JSON.stringify(myTaffyDB().stringify()));
			 }});
			
			 for(var i=0;i<myArrayData.length;i++){
				  var obj = myArrayData[i];
				  Ti.API.info('-----remove this row '+JSON.stringify(args));
				  myTaffyDB({'uid':obj.uid}).remove();
			 }
			 return false;     
		});
		return false;
}

exports.cleanTaffy = function() {
		
		var myTaffyDB = exports.getTaffyFromFile('latest');
		myTaffyDB().callback(function () {
			
	   myTaffyDB.settings({onRemove:function () {
					//alert(this);
					Ti.API.info('----------all data removed from TaffyDB ' +JSON.stringify(this));  
					//exports.saveTaffyToFile(myTaffyDB);
					
					//Ti.API.info(JSON.stringify(myTaffyDB().stringify()));
			}});
			  
			 myTaffyDB({id:"1"}).remove();
			 
			 setTimeout(function () {
				 Ti.API.info('------------going to save after remove');
				 Titanium.App.Properties.setString('lastTextSyncDate',"false");
				 exports.saveTaffyToFile(myTaffyDB);      
			},500);
			 
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


exports.upsertTaffy = function(primaryKey, jsonData, callback) {
	
		var myTaffyDB = exports.getTaffyFromFile('latest');
		
		myTaffyDB().callback(function () {

			 //myTaffyDB.upsert(primaryKey, jsonData);
			 
			myTaffyDB().upsert(primaryKey, jsonData);
			
			Ti.API.info('-----------To Save 1 '+JSON.stringify( myTaffyDB().stringify() ));
			
			var jsonData2 = myTaffyDB().stringify();
			
			
			Ti.API.info('-----------To Save 2 '+JSON.stringify(jsonData2));
			 
			 var myTaffyDB2 = Ti.taffy(jsonData2);
			 myTaffyDB2().callback(function () {
					 Ti.API.info('-----------To Save 3'+JSON.stringify(myTaffyDB2().stringify()));
					 
					 Ti.API.info('------------going to save after upsert '+callback);
					 Ti.API.info('check this has data '+JSON.stringify(jsonData2));
					 //Ti.taffy(myTaffyDB).save('snapsLatest');
					 
					 exports.saveTaffyToFile(myTaffyDB2);  
					 if(callback)
					 {
						Ti.App.fireEvent(callback); 
					 }
					 else
					 {
						 return true;
					 }
			 });
/*			 setTimeout(function (jsonData) {
				 Ti.API.info('------------going to save after upsert '+callback);
				 Ti.API.info('check this has data '+JSON.stringify(jsonData));
				 //Ti.taffy(myTaffyDB).save('snapsLatest');
				 
				 exports.saveTaffyToFile(jsonData);  
				 if(callback)
				 {
					Ti.App.fireEvent(callback); 
				 }
				 else
				 {
					 return true;
				 }
			},50);*/

			         
		});
}


//exports.deleteSyncTaffy = function(cloudID, jsonData, callback) {
//	
//		Ti.API.info('------------going to delete cloudID '+ cloudID);
//		
//		var myTaffyDB = exports.getTaffyFromFile('latest');
//		
//		myTaffyDB().callback(function () {
//			
//			myTaffyDB.settings({onRemove:function () {
//				
//					Ti.API.info('----------row removed from TaffyDB as part of sync clean up this -> ' + JSON.stringify(this));  
//					exports.saveTaffyToFile(myTaffyDB);
//					if(callback)
//					{
//						Ti.App.fireEvent(callback, jsonData);
//					}
//					else
//					{
//						return this;
//					}
//					
//			}});
//
//			myTaffyDB({post_id:cloudID}).remove();        
//		});
//}

/*exports.insertSyncTaffy = function(jsonData, self) {
	
		var myTaffyDB = TAFFY( TAFFY.loadFlatFile('snapsLatest.json') );
		myTaffyDB().callback(function () {
			  var c = jsonData.length;
			  for(var i=0;i<c;i++){
				  //delete this is row locally as it has been superceded // time delay to allow file to be saved
				  var cloudID = jsonData[i].post_id;
				  setTimeout(function(cloudID, myTaffyDB, self){
					   exports.deleteSyncTaffy(cloudID, myTaffyDB, self);
					   setTimeout(function(jsonData, self){
								if(i==(c-1))
								{
									//done deleting so on this insert refresh table
									Ti.API.info('------------done deleting update table');
									var callback = {win:self, func:'loadTable'};
								}
								else
								{
									var callback = false;
								}
								return exports.insertTaffy(jsonData, callback, true);
					  },0);
				  },0);
			  }

		});
}*/


exports.insertTaffy = function(jsonData, callback, hasuid) {
	
		var myTaffyDB = exports.getTaffyFromFile('latest');

		myTaffyDB().callback(function () {
			
			myTaffyDB.settings({onInsert:function () {

					  Ti.API.info('-----TaffyDB inserted row(s) ----- '+JSON.stringify(this)); 
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
			 
			 if(!hasuid)
			 {
				 var d = new Date();
				 var n = d.getTime();
				 jsonData.uid = n;
			 }
			 //device id
			 jsonData.deviceID = Titanium.Platform.id;
			 myTaffyDB.insert(jsonData);
			 
			 try{
			 	//myTaffyDB.insert(jsonData);
			 }
			 catch(e)
			 {
				 Ti.API.info('------------Error trying to insert into taffy '+JSON.stringify(e));
				 return false
			 }
			 //exports.saveTaffyToFile(myTaffyDB);
			         
		});
}



exports.updateTaffyV2 = function(UID, jsonData, callback, tableRow) {
	
		var myTaffyDB = exports.getTaffyFromFile('latest');
		
		Ti.API.info('pre ------------whats update data '+ JSON.stringify(jsonData));
		
		Ti.API.info('pre ------------whats UID '+ UID);

		myTaffyDB().callback(function () {
			
			Ti.API.info('pre ------------whats update data '+ JSON.stringify(jsonData));
			
			//var test1 = JSON.stringify(myJsonData);
			//var test2 = 'test;' 
			var retJsonData = jsonData;
			
			Ti.API.info('------------doing callback update Taffy ..');
			
			myTaffyDB.settings({onUpdate:function () {
				
					Ti.API.info('pre ------------whats update data '+ JSON.stringify(retJsonData));

					  Ti.API.info('onUpdate ------------whats TaffyID '+ UID);
					  Ti.API.info('onUpdate ------------whats update data '+ JSON.stringify(retJsonData));
					  Ti.API.info('--should have been updated---'+JSON.stringify(myTaffyDB().stringify()));
					  
					  if(callback)
					  {
							Ti.API.info('------------reached here ready for callback');
							if(tableRow)
							{
								var retExtJsonData = {taffyID:UID,updatedSnap:retJsonData,tableRow:tableRow};
							}
							else
							{
								var retExtJsonData = {taffyID:UID,updatedSnap:retJsonData};
							}
							Ti.App.fireEvent(callback, retExtJsonData);
					  }
					  else
					  {
							return myTaffyDB; 
					  }  
			}});
			
			 jsonData.deviceID = deviceID;
			 myTaffyDB({'uid':UID}).update(jsonData); 
			 //Ti.API.info('checking here for update '+JSON.stringify(myTaffyDB().stringify()));
			 exports.saveTaffyToFile(myTaffyDB);
			//Ti.API.info('query object '+JSON.stringify(x().stringy()));
			return false;
		});
		return false;
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
			
			 jsonData.deviceID = deviceID;
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