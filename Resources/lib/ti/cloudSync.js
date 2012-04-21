//parseapi = require('com.forge42.parseapi');
Ti.include('/lib/ti/global.js');	

exports.insertSnap = function(args) {
	
	Ti.API.info("-----------------------------------------------------starting insert or update");
	
	//check network
	//check wifi
	//check settings for when to sync
	
	//if has objectId use update;
	if( args.objectId == false  )
	{
		Ti.API.info('has an objectId of false so insert---'+args.objectId);
		//var pfObject = parseapi.PFObjectCreateObjectWithClassName("SnapObject");
		var pfObject =''; //todo
	}
	else
	{
		Ti.API.info('has an objectId so update---'+args.objectId+'-- '+JSON.stringify(args));
		//Ti.API.info('update snap type---'+args['updateSnapType']);
		//return false;
		var pfObject = updateSnap(args.objectId);
		if(pfObject==false) return false;
	}
	
	// Text, numbers
	//var x = parseapi.PFUserCurrentUser(); //store this in TaffyDB??
	if (args.title) pfObject.setObject(args.title, "title");
	if (args.category) pfObject.setObject(args.category, "category");
	if (args.dateCreated) pfObject.setObject(new Date(args.dateCreated), "dateCreated");
	if (args.dateUpdated) pfObject.setObject(new Date(args.dateUpdated), "dateUpdated");
	if (args.dateFor) pfObject.setObject(new Date(args.dateFor), "dateFor");
	//if (!args.userID) pfObject.setObject(parseapi.PFUserCurrentUser(), "user");  //todo
	if (args.isPrivate) pfObject.setObject(args.isPrivate, "isPrivate");
	if (args.status) pfObject.setObject(args.status, "status");

	// Save
	var result = pfObject.save(); //TODO change save in background
	
	if( result.succeeded ) {
		Ti.API.info("-----------------------------------------------------Success!");
		var created_object_id = pfObject.objectId;
		Ti.API.info("Created Object ID: " + created_object_id);
	} else {
		var created_object_id = false;
		Ti.API.info("Could not save object ErrorCode: " + result.errorCode + " Error: " + result.error);
	}
	return created_object_id;
};

updateSnap = function(created_object_id) {
	
	//var pfQuery = parseapi.PFQueryCreateQueryWithClassName("SnapObject");
	//todo
	//var result = pfQuery.getObjectWithId(created_object_id);
	
	if( result.succeeded ) {
	
		var pfObject = result.object; 
		
		return pfObject;
		
	} else {
		
		Ti.API.info("Could not get object to update ErrorCode: " + result.errorCode + " Error: " + result.error);
		
		return false;
	}
};	


exports.doSync = function() {
	
	Ti.API.info("-----------------------------------------------------starting sync");
	
	//alert('sync coming soon..');
			//check if network
			
			//---------------------------------------------start sync
			
			//start activity indicator
			
			//get latest update date from properties
			//var pfQuery = parseapi.PFQueryCreateQueryWithClassName("SnapObject");
			//todo
			var lastSyncDate = Titanium.App.Properties.getString('lastSyncDate',false);
			
			if(lastSyncDate)
			{
				//grab all data in cloud that is updated > lastSyncDate
				pfQuery.whereKey( {
					key: "updatedAt",
					greaterThanOrEqualTo: lastSyncDate	
				});
				
				// can be equalTo, greaterThan, greaterThanOrEqualTo, lessThan, lessThanOrEqualTo, notEqualTo
				//grab all data in taffy that is updated > lastSyncDate
			}
			else
			{
				//first sync
							
				
			}
			var dateawhileago=''; //use momentjs to get a date two months ago
			if(lastSyncDate==false || lastSyncDate<dateawhileago)
			{
							  
				  // pfQuery.limit = 20; 
				  // if lastSyncDate is false or more than 1 month first check how many records there are then 
				  // loop through in batches of 20 records 
				  // get in ascending order and use the last date as the new sync date so if it fails or lose signal 
				  // or cancel you are not at square 1
			  
				  
			}
			else
			{

			}
			
			//same for both
			pfQuery.whereKey( {
					key: "user",
					equalTo: '' //parseapi.PFUserCurrentUser()	//todo
				});
				
			pfQuery.orderByAscending("updatedAt");	
			
			var result = pfQuery.findObjects();

	
	if( result.succeeded ) {
	
		Ti.API.info("Successfully queried objects!");
		
		var pfObjects = result.objects;
		
		Ti.API.info("Query skip " + pfQuery.skip + ", limit " + pfQuery.limit + " and returned " + pfObjects.length + " PFObjects"); 
		Ti.API.info("Start Query Result -------------------------------- ");
		
		for( var i = 0; i < pfObjects.length; i++ )
		{
			var pfObject = pfObjects[i];
			Ti.API.info("  PFObject " + i);
			Ti.API.info("    objectId: " + pfObject.objectId );
			Ti.API.info("    updatedAt: " + pfObject.updatedAt );
			Ti.API.info("    createdAt: " + pfObject.createdAt );
			//Ti.API.info("    quantity: " + pfObject.objectForKey("quantity") );
			//Ti.API.info("    productData: " + JSON.stringify( pfObject.objectForKey("productData") ) )
			Ti.API.info("  End PFObject");
			Ti.API.info("");
		}
		Ti.API.info("End Query Result -------------------------------- ");
		
	} else {
		
		Ti.API.info("Could not query objects. ErrorCode: " + result.errorCode + " Error: " + result.error);
	}

			//download all changes from the date from cloud
			
			//show progress bar
			
			//grab all local changes from device
			
			//where same id in both list remove update with oldest date from that list
			
			//make local changes
			
			//make remote changes
	
};