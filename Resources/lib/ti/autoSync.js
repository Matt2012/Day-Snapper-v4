var cloudSync = require('/lib/ti/cloudSync');
var taffySync = require('/lib/ti/taffySync');

function _cleanDeleted()
{
	//should only be run first time app loads
	Ti.API.info('------------getting ready to delete old Taffys');
	taffySync.cleanDeletedTaffy(); //
}


exports.autoSync = function() {
	
	//_cleanDeleted(); //not related to ther steps so no need for callback do at the end
	_stepOne_checkNetwork();
}

function _stepOne_checkNetwork()
{
	if(Titanium.Network.online)
	{
		Ti.API.info('------------Network Good. Going to check User Prefs. ('+ Titanium.Network.networkType+ ' '+Titanium.Network.networkTypeName+') ------ ONE');
		_stepTwo_checkUserPreferences();
	}
	else
	{
		Ti.API.info('------------No Network. Not going to Sync------- ONE AND DONE');
		return false;
	}
}


function _stepTwo_checkUserPreferences()
{
	var noBackgroundSync = Titanium.App.Properties.getString('noBackgroundSync',"false");
	if(noBackgroundSync=="false")
	{
		Ti.API.info('------------Background Sync OK. Going to check WiFi/Mobile. ('+ Titanium.Network.networkType+ ' '+Titanium.Network.networkTypeName+') ------ TWO');
		var syncTextWifiOnly = Titanium.App.Properties.getString('syncTextWifiOnly',"false");
		
		if(Titanium.Network.networkType==Ti.Network.NETWORK_WIFI)
		{
			Ti.API.info('------------We Are on WIFI So do Text Sync  ------ TWO CTD.');
			_stepThree_pushLocal();
		}
		else
		{
			Ti.API.info('------------We Are on MOBILE So check User Prefs  ------ TWO CTD.');
			if(syncTextWifiOnly=='false')
			{
				Ti.API.info('------------ User says Yes to text sync   ------ TWO CTD');
				_stepThree_pushLocal();
			}
			else
			{
				Ti.API.info('------------ User says No to text sync on MOBILE  ------ TWO AND DONE');
			}
		}
	}
	else
	{
		Ti.API.info('------------User Preference. No Background Sync ------- TWO AND DONE');
		return false;
	}
	
}


function _stepThree_pushLocal()
{
	var unsyncedLocalData = taffySync.getTaffy('all_unsynced');
	var uCount = unsyncedLocalData.length
	Ti.API.info('------------How Many Local Data Items to Sync to Cloud? ------- THREE ('+uCount+')');
	
	if(uCount>0)
	{
		for(var i=0;i<uCount;i++){
			var jsonData = unsyncedLocalData[i];
			var callback = (i==uCount-1) ? 'autoSync.localPushed' : false;
			cloudSync.insertSnapV2(jsonData, callback);
		}
	}
	else
	{
		Ti.API.info('------------No Local data to Sync Go to Step 4 ------- THREE AND DONE');
		_stepFour_pullRemote();
	}
	
	Ti.App.addEventListener('autoSync.localPushed', function() {
		
		Ti.API.info('------------Got Callback after Last Local Push. Going to Step 4 ------- THREE AND DONE');
		_stepFour_pullRemote();
    });
}


function _stepFour_pullRemote()
{
	Ti.API.info('------------reached here  _stepFour_pullRemote ------- FOUR');
	cloudSync.doTextSync();
	
	Ti.App.addEventListener('autoSync.upsertLocal', function(e) {
		
		Ti.API.info('------------For each new row insert or update based on CloudID. FOUR CTD');
		
		Ti.API.info('------------oh hai reached here '+JSON.stringify(e.jsonData)+' callback:'+ e.callback);
		taffySync.upsertTaffy('[post_id]', e.jsonData, e.callback);
    });
	
	Ti.App.addEventListener('autoSync.remotePulled', function() {
		
		Ti.API.info('------------Got Callback after Last Remote Pull. FOUR AND DONE');
		Titanium.App.Properties.setString('autoSync', "false");
		Ti.App.fireEvent('loadTable');
		_stepFive_pushLocalFiles();
    });
}

function _stepFive_pushLocalFiles()
{
	Ti.API.info('------------reached here  _stepFive_pushLocalFiles ------- FIVE');
	
	var unsyncedLocalData = taffySync.getTaffy('all_unsynced_files');
	if(Titanium.Network.networkType==Ti.Network.NETWORK_WIFI)
	{
		Ti.API.info('------------We Are on WIFI So do push local and pull files  ------ FIVE AND DONE.');
		return false;
		//cloudSync.doFileSync();
	}
	else
	{
		Ti.API.info('------------We Are on MOBILE So check user prefs before push and pull files  ------ FIVE AND DONE.');
		var opts = {};
		opts.syncImagesWifiOnly = Titanium.App.Properties.getString('syncImagesWifiOnly',"true");
		opts.syncAudioWifiOnly = Titanium.App.Properties.getString('syncAudioWifiOnly',"true");
		opts.syncVideoWifiOnly = Titanium.App.Properties.getString('syncVideoWifiOnly',"true");
		//cloudSync.doFileSync(opts);
		return false;
	}
	
}