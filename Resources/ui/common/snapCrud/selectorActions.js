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
		
	w.addEventListener('saveSnapAndRefresh_step1', function(newSnap) {
		self.fireEvent('saveSnapAndRefresh_step2',newSnap);
		self.close();
	});
	
	w.open();
}

function ModifySnap(btnAction, self, data)
{
	
	switch(btnAction)
	{
		case'btnEdit':
			alert('send to correct form with data');
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
	Ti.include('/lib/thirdParty/taffy.js');	
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
		  //return false;
		  //hand this back using to trigger to close window and refresh table
		  //alert("do taffy update");
		  //if edit then go through the fields getting values.
		  // TAFFY(db(id).update({status:w}));
		  //var data = {};
		  var ndata = {};
		  ndata['id'] = data['___id'];
		  ndata['updatedSnap'] = {status:w,post_id:data['post_id']};
		  ndata['row'] = data['tableRow'];
		 // ndata['updateSnapType'] = 'status';
		 Ti.API.info(JSON.stringify(ndata));
		  self.fireEvent('modifySnapAndRefresh_step1',ndata);
	   }
	});
	confirmAlert.show();
}