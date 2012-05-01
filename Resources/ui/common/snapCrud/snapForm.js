function snapForm(btnAction, data) {

	Ti.include('/lib/ti/global.js');
	var ActionBarView = require('/ui/common/shared/ActionBarView');
	
	var win = new ui.Window({
		backgroundColor:'white',
		modal:true,
		navBarHidden:true
	});

	var forms = require('/lib/ti/forms');
	
	insertLocationValues();
	
	//var specific = require('/ui/common/snapCrud/snapForm'+btnAction); //used for call camera etc functions

	if(btnAction == 'btnNote')
	{
		var fields = [
		  { title:'Quick Note', type:'textarea', id:'postText'  }
		];
		
	}
	else if(btnAction == 'btnPhoto')
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
	
	var d1 = new Date().toISOString();
		
	var fieldsCore = [
		{ title:'Title', type:'text', id:'postTitle', isHidden:true  },
		{ title:'Date For', type:'date', id:'dateFor', isHidden:true  },
		{ title:'Location (click to change)', type:'text', id:'geoLocation', isHidden:true},
		{ title:'Tags (separate with a comma)', type:'text', id:'tags', isHidden:true  },
		{ title:'Snap (save!)', type:'submit', id:'submitForm'},
		{ title:'system:datefor', type:'text', id:'dateforval', value:d1, isHidden:true },
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
	
	win.addEventListener('prepareForm', function(e) {
		//populate id
		//called if in edit mode
		//var d0 = moment(e.snap.dateFor);
		//var d1 = d0.format("dddd, MMMM Do YYYY, h:mm a");
		//lbTitle.text = e.snap.content;
		//lbDate1.text = d1;
		
	});
	
	var topIcon = btnAction.substring(3).toLowerCase();
	var topBar = new ActionBarView({
		type:data.name,
		pos:'top',
		buttons: {
			btnIcon: {
				icon:topIcon,
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
			btnViewShow: {
				title:'Advanced View',
				width:140
			},
			btnViewHide: {
				title:'Simple View',
				width:0
			}
		}
	});

	win.add(bottomBar.viewProxy);
	
	var f=form.fieldRefs;
	var l=form.labelRefs;
		
	bottomBar.addEventListener('buttonPress', function(e) {
		//slide to advanced view
		//start off with showing advanced area on same page

		//Ti.API.debug(e);
		//Ti.API.info(e.id);
		
		//Ti.API.info('fieldRefs '+JSON.stringify(f));
		//Ti.API.info('labelRefs '+JSON.stringify(l));
		
		Ti.API.info(JSON.stringify(bottomBar));
		
		
		if(e.id=='btnViewShow')
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
			f.id.height = '40dp';
			l.label_id.height = '40dp';
			//l.label_geoLocation.height = '40dp';
			//bottomBar.viewProxy.buttonRefs.btnViewShow
			form.contentHeight = '1000dp';
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
			f.id.height = '0dp';
			l.label_id.height = '0dp';
			
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
			var d1 = new Date(value).toISOString();
			f.dateforval.value = d1;
     })
	
	form.addEventListener('submitForm', function()
	{
		var values = {};
		for (var i in f) {
			values[i] = f[i].value;	
			Ti.API.info('------------ '+values[i] +' = '+ f[i].value);
		}
		
		var textSnap = f['postText'].value;
		if(textSnap=='')
		{
			alert('Note snap can not be empty');
		}
		else
		{
			var icon = iconPath(topIcon,'bottom'); //if note set at top
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
				var titleSnap = textSnapA[0].substr(0,20);
			}
			
			
			var coordinates = [];

			var newSnap = {'title':titleSnap,'content':textSnap,'category':topIcon,'rightImage':icon,
							'tags_array':f['tags'].value,'coordinates':coordinates,'dateFor':f['dateforval'].value};
			Ti.API.info('------------off to save new snap stage 1---------------');
			win.fireEvent('saveSnapAndRefresh_step1', newSnap); //selectiorActions.js (just passes it back to 
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


function insertLocationValues()
{
	
	//add location this should happen on form on open so it can gecode
			var atlas = require('lib/ti/atlas/atlas');
			//Ti.API.info(JSON.stringify(atlas));
			//var z = atlas.Geo;
			//Ti.API.info('is enabled ' + atlas.Geo.enabled() );
			if(atlas.Geo.enabled())
			{
				var coordinates = atlas.Geo.getCurrentCoordinates(function (e) {
					if (e.success) {
						Ti.API.info(JSON.stringify(e));
						Ti.API.info("Success: " + e.latitude);
						
						var old = {};
						old.latitude = '';
						if(old.latitude!='')
						{
							alert('Do you want to over write current location with this one:'+ e.latitude);
						}
						
						return e;
					}
					else {
						Ti.API.info(JSON.stringify(e));
						Ti.API.info("Problem: " + e.message);
						return [];
					}
				});
				//Ti.API.info(JSON.stringify(y));
				//var coordinates = (y) ? y : [];
			}
	
	
	
}