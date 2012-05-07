

getTaffy = function(args, taffyDB) {

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


getTaffyLoad = function(which) {
	
		//Titanium.App.Properties.setString('isFirstTime',"false");
		var isFirstTime = Titanium.App.Properties.getString('isFirstTime',"true");

		if(isFirstTime==="true")
		{
			var myTaffyDB = prepopulateTaffy(myTaffyDB);
		}
		else
		{
			Titanium.App.Properties.setString('isFirstTime',"false");
			var myTaffyDB = getTaffyFromFile(myTaffyDB);
		}
		return myTaffyDB;
}


getTaffyFromFile = function(which) {
	
		//
		
		if(which=='latest')
		{
			//var myTaffyDB = Ti.taffy();
			//myTaffyDB.open('latest');
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



createTaffy = function(jsonData) {
	
		var myTaffyDB =  Ti.taffy(jsonData);
		saveTaffyToFile(myTaffyDB);
		Ti.API.info('-------------------Create TaffyDB from JSON');
		return myTaffyDB
}

saveTaffyToFile = function(myTaffyDB) {

		Ti.API.info('-------------------Saved to file: see below (not off)'); 
		Ti.API.info(JSON.stringify(myTaffyDB().stringify()));
		//myTaffyDB.save('latest');
		myTaffyDB.saveFlatFile('snapsLatest.json');
		
		//myTaffyDB = getTaffyFromFile('latest');
		var myStringArray = myTaffyDB().get();
			
			for (var i = 0; i < myStringArray.length; i++) {
				//alert(myStringArray[i]);
				Ti.API.info('item '+ i+' '+JSON.stringify(myStringArray[i]));
				//Do something
			}
		
		return;
}

cleanTaffy = function() {
	
		var myTaffyDB = getTaffyFromFile('latest');
		myTaffyDB().callback(function () {
			
		   myTaffyDB.settings({onRemove:function () {
					alert(this);
					Ti.API.info('----------all data removed from TaffyDB');  
					saveTaffyToFile(myTaffyDB);  
			}});
			
			Ti.API.info(JSON.stringify(myTaffyDB().stringify()));
			//myTaffyDB.destroy()
			 myTaffyDB().remove();
			 return false;     
		});
		return false;
}

countTaffy = function(myTaffyDB) {
	
		//var myTaffyDB = TAFFY( TAFFY.loadFlatFile('snapsLatest.json') );
		myTaffyDB().callback(function () {
			var c = this.count();
			Ti.API.info('------------count:'+ c);
			return c;           
		});
}

insertTaffy = function(jsonData, myTaffyDB, callback) {
	
		Ti.API.info('------------taffySync3');
		//var myTaffyDB = getTaffyFromFile('latest');

		myTaffyDB().callback(function () {
			
			myTaffyDB.settings({onInsert:function () {

					  Ti.API.info('-----TaffyDB inserted row ----- '+JSON.stringify(this)); 
					 // saveTaffyToFile(myTaffyDB);
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

updateTaffy = function(taffyID, jsonData, myTaffyDB, callback) {
	
		var myTaffyDB = getTaffyFromFile('latest');
		//myTaffyDB.open('latest');
		Ti.API.info('------------doing updateTaffy ..');

		myTaffyDB().callback(function () {
			
			Ti.API.info('------------doing callback updateTaffy ..');
			
			myTaffyDB.settings({onUpdate:function () {

					  Ti.API.info('onUpdate ------------whats TaffyID '+ taffyID);
					  Ti.API.info('onUpdate ------------whats update data '+ JSON.stringify(this));
					 // saveTaffyToFile(myTaffyDB);	
					  
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
			
			var myStringArray = myTaffyDB().get();
			
			for (var i = 0; i < myStringArray.length; i++) {
				//alert(myStringArray[i]);
				Ti.API.info(JSON.stringify(myStringArray[i]));
				//Do something
			}
			myTaffyDB(taffyID).update(jsonData); 
			//myTaffyDB().update(jsonData);
			return false;
		});
		return false;
}


updateTaffyCloudID = function(taffyID, cloudID, win) {

		var myTaffyDB = this.getTaffyFromFile('latest');
		myTaffyDB().callback(function () {
			myTaffyDB.settings({onUpdate:function () {
				
					Ti.API.info('------------whats TaffyID '+ taffyID);
					Ti.API.info('------------whats cloudID '+ cloudID);
					saveTaffyToFile(myTaffyDB);
 
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


doSync = function() {
	
}


loadTable = function(win,myTaffyDB ) {

		//cleanTaffy();
		//var myTaffyDB = this.getTaffyFromFile('latest');
		myTaffyDB().callback(function () {
			
			var myArrayData = getTaffy('all_live', myTaffyDB);
			win.fireEvent('setTableData', myArrayData);

		});
		
}


prepopulateTaffy = function() {

		//check no rows in taffydb?
		Ti.API.info('------------First Time Set Welcome Data--------------------');
		var d = new Date();
		var d1 = new Date().toISOString();
		var d2 = d.getTime();
		var d3 = d2+1;
		var rightImage = iconPath('note','bottom');
		var defaultsDD = {"dateCreated":d1, "dateUpdated":d1, "dateFor":d1, "status":"live", "userID":userID, "rightImage":rightImage, "category":"note", "isSynced":false};
		var r1 = {"title":"Welcome to Day Snapper.","content":"Here are a few tips to get you started","tags_array":"cool, beans","uid":d2};
		var r2 = {"title":"A short note about Tiny.coop.","content":"Tiny is a web coop. Owned and run by its users.","uid":d3};
		_.extend(r1, defaultsDD);
		_.extend(r2, defaultsDD);
		var myJsonData = [r1,r2];
		
		myTaffyDB = createTaffy(myJsonData);
		
		myTaffyDB().callback(function () {

			return myTaffyDB;

		});

}