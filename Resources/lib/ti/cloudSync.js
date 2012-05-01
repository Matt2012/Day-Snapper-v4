Ti.include('/lib/ti/global.js');	

exports.insertSnap = function(args, self, taffyID, tableRow) {
	
	var isCool = doNetworksSyncSettingsCheck();
	
	if(isCool.success)
	{
		Ti.API.info("-----------------------------------------------------starting insert or update");
		
		var post = {}
		var x = {};
		//if update these might be passed
		if (args.title) post['title'] = args.title;
		if (args.content) post['content'] = args.content;
		if (args.category) x['category'] = args.category;
		if (args.category) x['tags_array'] = args.tags_array;
		if (args.dateFor) x['dateFor'] = new Date(args.dateFor);
		if (args.isPrivate) x['privacy'] = args.privacy;
		if (args.status) x['status'] = args.status;
		if (args.coordinates) x['coordinates'] = args.coordinates;
		
		x['dateUpdated'] = new Date(args.dateUpdated);
	
		//if has post_id use update;
		if( args.post_id !== 'undefined' || args.post_id === false || args.post_id =='' )
		{
			Ti.API.info('------------------starting insert (has an post_id of undefined or false ) '+args.post_id);
	
			x['dateCreated'] = new Date(args.dateCreated);
	
			post['custom_fields'] = x;
			
			Ti.API.info('------------whats TaffyID cs '+ taffyID);
			Ti.API.info('------------whats Table Row cs '+ tableRow);

			Cloud.Posts.create(post, function (e) {
					if (e.success) {
						alert('Created!');
						Ti.API.info(JSON.stringify(e));
						args.post_id = e.posts[0].id;
						args.lastSynced = x['dateCreated'];
						args.isSynced = true;
						args.keys = {'taffyID':taffyID,'tableRow':tableRow};
						self.fireEvent('saveSnapAndRefresh_step5',args);
						return false;
					}
					else {
						Ti.API.info(JSON.stringify(e));
						Ti.API.info("Problem. ErrorCode: " + e.code + " Error: " + e.message);
						return false;
					}
				});
		}
		else
		{
			Ti.API.info('------------------starting update (has an post_id)'+args.post_id+' '+JSON.stringify(args));
			
			post['custom_fields'] = x;
			
			Cloud.Posts.update(post, function (e) {
				if (e.success) {
					alert('Updated!');
					Ti.API.info(JSON.stringify(e));
					args.lastSynced = x['dateCreated'];
					args.isSynced = true;
					self.fireEvent('saveSnapAndRefresh_step5',args, taffyID, tableRow);
				}
				else {
					Ti.API.info(JSON.stringify(e));
					Ti.API.info("Problem. ErrorCode: " + e.code + " Error: " + e.message);
				}
				return;
			});
			
			
		}
	}
	else
	{
		Ti.API.info('Skipped Syncing because'+isCool['message']);
	}
	
}

	


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
				
				
				var query = {user_id: userID};
				
				Cloud.Posts.query(query, function (e) {
				if (e.success) {
						if (e.posts.length == 0) {
							alert('Nothing to bring down!');
						}
						else {
							var data = [];
							for (var i = 0, l = e.posts.length; i < l; i++) {
								data.push({
									title: e.posts[i].title,
									id: e.posts[i].id
								});
							}
							//do taffyintegration
							//table.setData(data);
						}
					}
					else {
						error(e);
					}
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
			
			

	
	if( result.succeeded ) {
	
		Ti.API.info("Successfully queried objects!");
		
		
		
	} else {
		
		Ti.API.info("Could not query objects. ErrorCode: " + result.errorCode + " Error: " + result.error);
	}

			//download all changes from the date from cloud
			
			//show progress bar
			
			//grab all local changes from device
			
			//where same id in both list remove update with oldest date from that list
			
			//make local changes
			
			//make remote changes
	
}

function doNetworksSyncSettingsCheck()
{
	//check network
	//check wifi
	//check settings for when to sync
	var isCool = {};
	isCool.success = true;
	return isCool;
}