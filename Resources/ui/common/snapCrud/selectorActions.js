function doAction(which, btnAction, self, data)
{
	if(which=='Snap')
	{
		openSnapWindow(btnAction, self, data);
	}
	else if(which=='TagOpts')
	{
		TagOpts(btnAction);
	}
	else if(which=='ModifySnap')
	{
		ModifySnap(btnAction, self, data);
	}
	else
	{
		//which == tag
		Tag(btnAction);
	}
}

function TagOpts(btnAction)
{
	alert("Tag Options: " + btnAction + ", coming soon.");
}

function Tag(btnAction)
{
	alert("Tag Sort: " + btnAction + ", coming soon.");
}


function openSnapWindow(btnAction, self, data)
{
	var masterModal = require('/ui/common/snapCrud/snapForm');
	var w = new masterModal(btnAction, data);
		
	w.addEventListener('saveSnap_passBack_step1', function(newSnap) {
		Ti.API.info('------------off to save new snap stage 2---------------');
		self.fireEvent('saveSnap_passBack_step2',newSnap); // btnAddWindow.js (just passes it back MasterView.js) 
		self.close();
	});
	
	w.addEventListener('updateSnap_passBack_step1', function(updatedSnap) {
		Ti.API.info('------------off to update snap stage 2---------------');
		self.fireEvent('updateSnap_passBack_step2',updatedSnap); // detailWindow.js (just passes it back SnapsScrollableTableView.js) 
		self.close();
	});
	
	w.open();
}

function ModifySnap(btnAction, self, data)
{
	
	switch(btnAction)
	{
		case'btnEdit':
			openSnapWindow(btnAction, self, data); //Make sure uid and whole row is in data
		break;
		case'btnArchive':
			modifyRecord('Archive', self, data);
		break;
		case'btnDelete':
			modifyRecord('Delete', self, data);
		break;
		case'btnTag':
		    //show view with note 
			alert('Tagging coming soon.');
		break;
	}
}


function modifyRecord(which, self, data)
{
	//Ti.include('/lib/thirdParty/taffy.js');	
	var t = which + " Snap";
	var w = which.toLowerCase();
	var m = "Are you sure you want to " + w + " this snap?";
	var confirmAlert = Titanium.UI.createAlertDialog({ title: t, message: m, buttonNames: ['Yes', 'No'], cancel: 1 });
	
	confirmAlert.addEventListener('click', function(e) { 
	   Titanium.API.info('e = ' + JSON.stringify(e));
	   //Clicked cancel, first check is for iphone, second for android
	   if (e.cancel === e.index || e.cancel === true) {
		  return;
	   }
	   //now you can use parameter e to switch/case   //cancel is 1 so must be 0
	   if(e.index==0) {
			Titanium.API.info('Clicked button 0 (YES)');
			Ti.API.info('data at this point--- '+JSON.stringify(data));
  
			var myJsonData = {};
			var post_id = data['post_id'];
			var uid = data['uid'];
			myJsonData['updatedSnap'] = {status:w,post_id:post_id,uid:uid};
			myJsonData['tableRow'] = data['tableRow'];
			Ti.API.info(JSON.stringify(myJsonData));
			self.fireEvent('updateSnap_passBack_step2',myJsonData); /*detailWindow.js, passes it back to SnapsScrollableTableView.js*/
	   }
	});
	confirmAlert.show();
}