function snapForm(btnAction, data) {

	Ti.include('/lib/ti/global.js');
	var ActionBarView = require('/ui/common/shared/ActionBarView');
	
	var isModal = (Ti.Platform.osname === 'android') ? true : false;
	
	var win = new ui.Window({
		backgroundColor:'white',
		modal:isModal,
		navBarHidden:true
	});

	var forms = require('/lib/ti/forms');

	if(btnAction != 'btnEdit')
	{
		//new snap
		var category = btnAction.substring(3).toLowerCase(); 
		//var da = moment("YYYY,MM,DD");
		var d1 = new Date();
		var d2 = new Date().toISOString();
	}
	else
	{
		//edit snap
		var moment = require('/lib/thirdParty/moment.min');
		var da = moment(data.dateFor, "YYYY,MM,DD");
		var db = new Date(da);
		//Ti.API.info('------------reached here '+db);
		var category = data.category; 
		//var d1 = new Date(2014,3,12);
		var d1 = new Date(da);
		//var d3  = new Date(2014,3,12);
		//Ti.API.info('------------reached here '+d3);
		var d2 = data.dateFor;
	}


	//var specific = require('/ui/common/snapCrud/snapForm'+btnAction); //used for call camera etc functions

	if(category == 'note')
	{
		var fields = [
		  { title:'Quick Note', type:'textarea', id:'postText'  }
		];
		
	}
	else if(category == 'photo')
	{
		var fields = [
		  { title:'Thumbnail', type:'photo', id:'photo', value:false  },
		  { title:'Take a Photo', type:'button', id:'callCamera' },
		  { title:'From Gallery', type:'button', id:'callGallery'  }
		];
	}
	else
	{
		var fields = [
		  { title:'Quick Note', type:'textarea', id:'postText'  }
		];
		
	}
	
	
		
	var fieldsCore = [
		{ title:'Title', type:'text', id:'postTitle', isHidden:true  },
		{ title:'Date For', type:'date', id:'dateFor', isHidden:true, value:d1  },
		{ title:'Location (click to change)', type:'text', id:'geoLocation', isHidden:true},
		{ title:'Tags (separate with a comma)', type:'text', id:'tags', isHidden:true  },
	/*	{ title:'Snap (save!)', type:'submit', id:'submitForm'},*/
		{ title:'system:datefor', type:'text', id:'dateforval', value:d2, isHidden:true },
		{ title:'system:coordinates', type:'text', id:'coordinatesval', isHidden:true},
		{ title:'system:id', type:'text', id:'id', isHidden:true },
	];
	
	//fields.concat(fieldsSpecific, fieldsCore);
	//var fields = [];
	fields.push.apply(fields, fieldsCore);
	
	//alert(JSON.stringify(fields));
	Ti.API.info(JSON.stringify(fields));
	var fields2 = [
		{ title:'State', type:'picker', id:'state', data: [
			'Vermont', 'Virginia', 'Washington', 'West Virginia' 
		], value:false  }

	];
	
	
	var form = forms.createForm({
		style: forms.STYLE_LABEL,
		fields: fields
	});
	
	win.add(form);
	


	
	
	var topBar = new ActionBarView({
		type:data.name,
		pos:'top',
		buttons: {
			btnIcon: {
				icon:category,
				width:40
			}
		}
	});
	
	topBar.addEventListener('close', function() {
		win.close();
		return false;
	});

	win.add(topBar.viewProxy);
	
	var bottomBar = new ActionBarView({
		pos: 'bottom',
		buttons: {
			btnSave: {
				title:'Save Snap',
				width:120
			},
			btnSpacer: {
				title:'',
				width:100
			},
			btnViewShow: {
				title:'Advanced View',
				width:140
			},
			btnViewHide: {
				title:'Simple View',
				width:0
			},
			
		}
	});

	win.add(bottomBar.viewProxy);
	
	var f=form.fieldRefs;
	var l=form.labelRefs;
	
	//var coordinates = insertLocationValues();
	//Ti.API.info(JSON.stringify(coordinates));
	//f.coordinatesval.value = coordinates;
	Ti.include('/lib/ti/geoSync.js');

	var location = getLocation();
	
	Ti.API.info(JSON.stringify(location));
	if(typeof location != "undefined")
	{
		f.coordinatesval.value = [location.latitude,location.longitude];
	}
	
	Ti.API.info(JSON.stringify(f));
	
	
	if(typeof data.title != "undefined")
	{
		Ti.API.info('Preparing form for edit');
		//populate id
		f.postTitle.value = data.title;
		f.postText.value = data.content;
		
		f.tags.value = data.tags_array;
		f.coordinatesval.value = data.coordinates;
		f.id.value = data.uid+''; //makes sures its a string so no formatting // may not be needed
		
		l.label_postText.text = 'Edit ' + l.label_postText.text;
	/*	f.submitForm.title = 'Edit Snap';*/

		var topIcon = data.category;
	}
	
		
	bottomBar.addEventListener('buttonPress', function(e) {
		//slide to advanced view
		//start off with showing advanced area on same page

		//Ti.API.debug(e);
		//Ti.API.info(e.id);
		
		//Ti.API.info('fieldRefs '+JSON.stringify(f));
		//Ti.API.info('labelRefs '+JSON.stringify(l));
		
		Ti.API.info(JSON.stringify(bottomBar));
		
		if(e.id=='btnSave')
		{
			form.fireEvent('submitForm');	
		}
		else if(e.id=='btnViewShow')
		{
			f.postTitle.height = '40dp';
			f.tags.height = '40dp';
			f.dateFor.height = '140dp';
			//f.geoLocation.height = '40dp';
			l.label_postTitle.height = '40dp';
			l.label_tags.height = '40dp';
			l.label_dateFor.height = '40dp';
			
			f.coordinatesval.height = '40dp';
			l.label_coordinatesval.height = '40dp';
			//f.id.height = '40dp';
			//l.label_id.height = '40dp';
			//l.label_geoLocation.height = '40dp';
			//bottomBar.viewProxy.buttonRefs.btnViewShow
			form.contentHeight = '900dp';
			form.backgroundColor = '#95CAFF';
			
			bottomBar.buttonRefs.btnViewShow.width = '0';
			bottomBar.buttonRefs.btnViewHide.width = '140dp';
			bottomBar.buttonRefs.btnViewHide.right = '0dp';
			
			//f.postText.height = '100dp';
		}
		else
		{
			//f.postText.height = '120dp';
			f.postTitle.height = '0dp';
			f.tags.height = '0dp';
			f.dateFor.height = '0dp';
			//f.geoLocation.height = '0dp';
			l.label_postTitle.height = '0dp';
			l.label_tags.height = '0dp';
			l.label_dateFor.height = '0dp';
			//l.label_geoLocation.height = '0dp';
			
			f.coordinatesval.height = '0dp';
			l.label_coordinatesval.height = '0dp';
			//f.id.height = '0dp';
			//l.label_id.height = '0dp';
			
			bottomBar.buttonRefs.btnViewShow.width = '140dp';
			
			bottomBar.buttonRefs.btnViewHide.width = '0';
			//form.contentHeight = '400dp';
			form.contentHeight = '400dp';
			form.backgroundColor = '#ffffff';
		}

		
		
		
			//Ti.API.info('btnView: '+JSON.stringify(bottomBar.buttonRefs.btnViewShow));
	});
	
	form.addEventListener('dateFor', function(value)
	{
			Ti.API.info('------------date for changed '+value);
			var d1 = new Date(value).toISOString();
			f.dateforval.value = d1;
     })
	
	form.addEventListener('submitForm', function()
	{
		var values = {};
/*		for (var i in f) {
			values[i] = f[i].value;	
			Ti.API.info('------------ '+values[i] +' = '+ f[i].value);
		}*/
		
		var textSnap = f['postText'].value;
		var coordinates = f['coordinatesval'].value;
		if(textSnap=='')
		{
			alert('Note snap can not be empty');
		}
		else
		{
			var icon = iconPath(category,'bottom'); //if note set at top
			//Refactor Move title to function
			var title = f['postTitle'].value;
			//Ti.API.info('------------reached here 1 '+title);
			if(title!='')
			{
				var titleSnap = title;
			}
			else
			{
				var lines = textSnap.split('\n'); //get first line
				//Ti.API.info('------------reached here 2 '+lines[0]);
				//Ti.API.info(JSON.stringify(lines));
				var textSnapA = lines[0].split('.'); //get first sentence
				//Ti.API.info('------------reached here 3 '+textSnapA[0]);
				var titleSnap = textSnapA[0].substr(0,60);
			}
			
			
			//var coordinates = [];

			var snap = {'title':titleSnap,'content':textSnap,'category':category,'rightImage':icon,
							'tags_array':f['tags'].value,'coordinates':coordinates,'dateFor':f['dateforval'].value};
							
			if(f['id'].value=='')
			{
				Ti.API.info('------------off to save new snap stage 1---------------');
				win.fireEvent('saveSnap_passBack_step1', snap); //selectorAction.js (just passes it back btnAddWindow.js) 
			}
			else
			{
				snap.post_id = data.post_id; //CloudID
				snap.uid = data.uid; //TaffyID
				Ti.API.info('------------off to save updated snap stage 1---------------');
				var snap = {updatedSnap:snap, tableRow:data.tableRow};
				Ti.API.info(JSON.stringify(snap));
				win.fireEvent('updateSnap_passBack_step1', snap); //selectorAction.js (just passes it back btnAddWindow.js) 
			}
			win.close();
		}
	});
	
	if(btnAction == 'btnPhoto')
	{
		form.addEventListener('callCamera', function()
		{
			alert('open camera');
		});
		
		form.addEventListener('callGallery', function()
		{
			alert('open gallery');
		});
	}


	return win;
}

module.exports = snapForm;