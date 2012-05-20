Ti.include('/lib/ti/global.js');	
var taffySync = require('/lib/ti/taffySync');
//TODO on start up delete status 'deleted' posts that have a cloudID and are more than a month old.

exports.deleteSnap = function(postID){
	//Refactor so anything can be deleted 
	Ti.API.info('------------doing delete here for postID '+postID);
	Cloud.Posts.remove({
		post_id: postID
	}, function (e) {
		if (e.success) {
			Ti.API.info(JSON.stringify(e));
			Ti.API.info("Success");
		}
		else {
			Ti.API.info(JSON.stringify(e));
			Ti.API.info("Problem. ErrorCode: " + e.code + " Error: " + e.message);
		}
	});
   
}


exports.bigDelete = function(){
	
	//Here be dragons!
	Ti.API.info('------------doing big delete here for user '+userID);
	
	  Cloud.Posts.query({per_page:10},function (e) {
            if (e.success) {
				Ti.API.info('------------ok so we got whats up there');
                if (e.posts.length == 0) {
                    Ti.API.info('------------saying there is nothing left..?');
                }
                else {
					Ti.API.info('------------there are ' +e.posts.length+' records' );
                    var data = [];

                    for (var i = 0, l = e.posts.length; i < l; i++) {
						var postID = e.posts[i].id;
						Ti.API.info('------------reached here: record '+i+' to delete: postID: '+postID);
						 var doDelete = (function(postIDvalue) {
							 Ti.API.info('------------closure delete for '+postIDvalue);
							 exports.deleteSnap(postIDvalue);
						 })(postID);
                    }
                }
            }
            else {
				 error(e);
			}
	  });
   
}






exports.insertSnapV2 = function(data, callback) {
	
	if(Titanium.Network.online)
	{
		var post = _prepareData(data);
		
		
		if( data.post_id === 'undefined' || data.post_id === false || data.post_id === '' )
		{
			Ti.API.info('----------------- Insert (no valid post_id) '+data.post_id);
			
			Cloud.Posts.create(post, function (e) {
					_afterCloudPush(e, data, callback);
			});
		}
		else
		{
			Ti.API.info('----------------- Update (valid post_id) '+data.post_id);

			Cloud.Posts.update(post, function (e) {
					_afterCloudPush(e, data, callback);
			});
		}
	}
	else
	{
		Ti.API.info('Skipped Syncing because no network');
		return false;
	}
}

function _prepareData(data)
{
	var post = {};
	var x = {};
	if (data.post_id) post['post_id'] = data.post_id;
	if (data.title) post['title'] = data.title;
	if (data.content) post['content'] = data.content;
	if (data.category) x['category'] = data.category;
	if (data.category) x['tags_array'] = data.tags_array;
	if (data.dateFor) x['dateFor'] = new Date(data.dateFor);
	if (data.isPrivate) x['privacy'] = data.privacy;
	if (data.status) x['status'] = data.status;
	if (data.coordinates) x['coordinates'] = data.coordinates;
	if (data.deviceID) x['deviceID'] = data.deviceID;
	post['custom_fields'] = x;
	return post;
	//x['dateUpdated'] = new Date(data.dateUpdated); //do we need this?? maybe for date synced?? only in taffy
	//x['dateCreated'] = new Date(data.dateCreated); only in taffy
}

function _afterCloudPush(e, jsonData, callback)
{
	if (e.success) {
		Ti.API.info('---cloud push success----'+JSON.stringify(e));
		jsonData.post_id = e.posts[0].id;
		jsonData.lastSynced = e.posts[0].updated_at;
		jsonData.dateUpdated = e.posts[0].updated_at; 
		jsonData.isSynced = true;

		taffySync.updateTaffyV2(jsonData.uid, jsonData, callback);
	}
	else {
		Ti.API.info(JSON.stringify(e));
		Ti.API.info("Problem. ErrorCode: " + e.code + " Error: " + e.message);
		return false;
	}
	
}



exports.insertSnap = function(args, self, taffyID, tableRow) {
	
	//also check user preferences about when to sync
	if(Titanium.Network.online)
	{
		Ti.API.info("-----------------------------------------------------starting insert or update");
		
		Ti.API.info('check these values'+JSON.stringify(args));
		
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
		if (args.deviceID) x['deviceID'] = args.deviceID;
		
		x['dateUpdated'] = new Date(args.dateUpdated); //do we need this?? maybe for date synced??
	
		//if has post_id use update;
		if( args.post_id === 'undefined' || args.post_id === false || args.post_id === '' )
		{
			Ti.API.info('------------------starting insert (has an post_id of undefined or false ) '+args.post_id);
	
			x['dateCreated'] = new Date(args.dateCreated);
	
			post['custom_fields'] = x;
			
			Ti.API.info('------------whats TaffyID cs insert '+ taffyID);
			Ti.API.info('------------whats Table Row cs insert '+ tableRow);

			Cloud.Posts.create(post, function (e) {
					if (e.success) {
						Ti.API.info('---cloud insert success----'+JSON.stringify(e));
						args.post_id = e.posts[0].id;
						args.lastSynced = x['dateCreated'];
						args.isSynced = true;
						if(typeof TaffyID != 'undefined')
						{
							//just a one off fire back to table and update taffy with isSynced
							args.keys = {'taffyID':taffyID,'tableRow':tableRow};
							self.fireEvent('saveSnap_taffyUpdate_step6',args);
							return false;
						}
						else
						{
							//part of mass update
							return args;
						}
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
			post['post_id'] = args.post_id;
			
			Ti.API.info('------------whats TaffyID cs update '+ taffyID);
			Ti.API.info('------------whats Table Row cs update '+ tableRow);
			
			Cloud.Posts.update(post, function (e) {
				if (e.success) {
					//alert('Updated!');
					Ti.API.info(JSON.stringify(e));
					args.lastSynced = x['dateCreated'];
					args.isSynced = true;
					args.keys = {'taffyID':taffyID,'tableRow':tableRow};
					self.fireEvent('saveSnap_taffyUpdate_step6',args); 
				}
				else {
					Ti.API.info(JSON.stringify(post));
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


exports.doTextSync = function(page) {

	var page = (page) ? page : 1;
	
	Ti.API.info("-----------------------------------------------------starting text sync");
		Titanium.App.Properties.setString('tempTextSyncDate',"false");
		var lastTextSyncDate = Titanium.App.Properties.getString('lastTextSyncDate',"false");
		Ti.API.info('------------do we have a last synced date '+lastTextSyncDate);
		var moment = require('/lib/thirdParty/moment.min');
		var d = new Date();
		var currentDate = moment(d).format();
		Ti.API.info('------------current Date '+ currentDate);
		var queryObj = {};
		queryObj.user_id = userID;
		queryObj.where = {};
		queryObj.where["custom_fields.deviceID"] = { '$ne': deviceID };
		if(lastTextSyncDate!="false")
		{
			Ti.API.info('------------lastTextSyncDate not false so use in query '+lastTextSyncDate);
			queryObj.where["updated_at"] = { '$gt': lastTextSyncDate };
		}
		queryObj.page = page;
  		queryObj.per_page = 10;
		queryObj.order = '-updated_at';
		Cloud.Posts.query(queryObj,function (e) {
			Ti.API.info('------------what page '+page);
			Ti.API.info(JSON.stringify(e));
            if (e.success) {
				var c = e.posts.length;
                if (c == 0) {
                    //no data
					Ti.API.info('------------no data');
					Ti.API.info('------------current Date '+ currentDate);
					Titanium.App.Properties.setString('lastTextSyncDate',currentDate);
					Ti.App.fireEvent('autoSync.remotePulled'); 
                }
                else {
					Ti.API.info('------------' + c + ' records to sync ');
					var posts = e.posts;
					var taffy = [];
					//Ti.API.info(JSON.stringify(e));
					//Ti.API.info(JSON.stringify(posts));
					
					var d = new Date();
					var n = d.getTime();
					
					for(var i=0;i<posts.length;i++){
						var obj = posts[i];
						//Ti.API.info('This snap '+JSON.stringify(obj));
						
						taffy[i] = {};
						taffy[i].post_id = obj.id;
						taffy[i].title = obj.title;
						taffy[i].content = obj.content;
						
						if(typeof(obj.custom_fields) != 'undefined')
						{
							var cf = obj.custom_fields;
							if( typeof(cf.category) != 'undefined' ) 
								{
									taffy[i].category = cf.category;
									taffy[i].rightImage = iconPath(cf.category,'bottom');
									
								}
							if( typeof(cf.tags_array) != 'undefined' ) taffy[i].tags_array = cf.tags_array;
							if( typeof(cf.dateFor) != 'undefined' ) taffy[i].dateFor = cf.dateFor;
							if( typeof(cf.status) != 'undefined' ) taffy[i].status = cf.status;
							if( typeof(cf.dateUpdated) != 'undefined' ) taffy[i].dateUpdated = cf.dateUpdated;
							if( typeof(cf.dateCreated) != 'undefined' ) taffy[i].dateCreated = cf.category;
							if( typeof(cf.coordinates) != 'undefined' ) taffy[i].coordinates = cf.coordinates;
							if( typeof(cf.privacy) != 'undefined' ) taffy[i].privacy = cf.privacy;
						}
						
						taffy[i].lastSynced = new Date();
						taffy[i].isSynced = true;
						taffy[i].userID = userID;
						n = n+i;
						taffy[i].uid = n;
						taffy[i].deviceID = deviceID;
						//Ti.API.info('This Taffy for insert '+JSON.stringify(taffy[i]));
					}
					
					//delete taffy row with given cloudID if it exists first
					//taffySync.insertSyncTaffy(taffy);
					//Ti.App.fireEvent('autoSync.deleteLocal', taffy);
					
					
					Ti.API.info('looking for updated_at '+JSON.stringify(obj));
					Titanium.App.Properties.setString('tempTextSyncDate',obj.updated_at);
					//self.fireEvent('saveSnap_taffyUpdate_step6',e.posts); 
					if(c==10)
					{
						//Titanium.App.Properties.setString('tempTextSyncDate',"false");
						var tempTextSyncDate = Titanium.App.Properties.getString('tempTextSyncDate',"false");
						Ti.API.info('------------this was page '+page+' with '+c+' records. Going to loop again. Temp sync date '+tempTextSyncDate);
						var retData = {jsonData:taffy,callback:false};
						Ti.App.fireEvent('autoSync.upsertLocal',retData);
						//if c==10 which is default chunk keep looping after success
						exports.doTextSync(page+1);
					}
					else
					{
						lastSyncDate = Titanium.App.Properties.setString('lastTextSyncDate',currentDate);
						Ti.API.info('------------this was page '+page+' with '+c+' records. Not going to loop again. Last sync date '+ lastSyncDate);
						var retData = {jsonData:taffy,callback:'autoSync.remotePulled'};
						Ti.App.fireEvent('autoSync.upsertLocal',retData);
					}
					
                }
            }
            else {
				//if cloudsync failed here use the temp date from the last updated loop
				var tempTextSyncDate = Titanium.App.Properties.getString('tempTextSyncDate',"false");
				if(tempTextSyncDate)
				{
					Ti.API.info('------------is lastTextSyncDate false : '+lastTextSyncDate+' or tempTextSyncDate>lastTextSyncDate: '+tempTextSyncDate+' > '+lastTextSyncDate);
					if(lastTextSyncDate=="false" || tempTextSyncDate>lastTextSyncDate)
					{
						Titanium.App.Properties.setString('lastTextSyncDate',tempTextSyncDate);
						Ti.API.info('------------set lastTextSyncDate ' + tempTextSyncDate);
					}
				}
				Ti.API.info("Problem. ErrorCode: " + e.code + " Error: " + e.message);
                Ti.API.info(JSON.stringify(e));
				return false;
            }
        });

			//show progress bar
			//where same id in both list remove update with oldest date from that list
			//make local changes
			//make remote changes

}


exports.doImagesSync = function() {
	
	Ti.API.info("-----------------------------------------------------starting file sync (not done) ");
	

			//download all changes from the date from cloud
			
			//show progress bar
			
			//grab all local changes from device
			
			//where same id in both list remove update with oldest date from that list
			
			//make local changes
			
			//make remote changes
	
}

exports.doAudioSync = function() {
	
	Ti.API.info("-----------------------------------------------------starting sync");
	

			//download all changes from the date from cloud
			
			//show progress bar
			
			//grab all local changes from device
			
			//where same id in both list remove update with oldest date from that list
			
			//make local changes
			
			//make remote changes
	
}

exports.doVideoSync = function() {
	
	Ti.API.info("-----------------------------------------------------starting sync");
	

			//download all changes from the date from cloud
			
			//show progress bar
			
			//grab all local changes from device
			
			//where same id in both list remove update with oldest date from that list
			
			//make local changes
			
			//make remote changes
	
}

