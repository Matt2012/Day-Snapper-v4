function doAction(which, btnAction, self, data)
{
	if(which=='Snap')
	{
		SnapAction(btnAction, self);
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

function SnapAction(btnAction, self)
{
	//alert(btnAction);
	switch(btnAction)
	{
		case'btnNote':
			openSnapWindow(btnAction, self)
		break;
		case'btnCamera':
			openCamera();
		break;
		case'btnGallery':
			openOther();
		break;
		case'btnVideo':
			openOther();
		break;
		case'btnVideo':
			openOther();
		break;
		case'btnBlog':
			openOther();
		break;
		default:
			openOther();
		break;
	}
}

function openCamera() {
	
		alert('open Carmera');
}

function openGallery() {
	
		alert('open Gallery');
}

function openOther() {
	
		alert('This Snap Coming Soon');
}

function openNote() {
	
		alert('This Note Coming Soon');
}

function openSnapWindow(btnAction, self)
{
	var url = '/ui/common/snapCrud/'+btnAction+'Snap';
	var masterModal = require(url);
	var w = masterModal();
		
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
			alert('Editing coming soon.');
		break;
		case'btnArchive':
			modifyRecord('Archive', self, data);
		break;
		case'btnDelete':
			modifyRecord('Delete', self, data);
		break;
		case'btnTag':
		    //alert('Going to modify record ' + data['___id'] + ' - ' + btnAction);
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
		  ndata['updatedSnap'] = {status:w,objectId:data['objectId']};
		 // ndata['updateSnapType'] = 'status';
		  self.fireEvent('modifySnapAndRefresh_step1',ndata);
	   }
	});
	confirmAlert.show();
}