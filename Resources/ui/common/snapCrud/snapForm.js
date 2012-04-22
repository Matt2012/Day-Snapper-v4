function snapForm(btnAction, data) {

	Ti.include('/lib/ti/global.js');
	var ActionBarView = require('/ui/common/shared/ActionBarView');
	
	var win = new ui.Window({
		backgroundColor:'white',
		modal:true,
		navBarHidden:true
	});

	var forms = require('/lib/ti/forms');
	
/*	if(1==2)
	{
		
		
		
	}
	else
	{
		var addFields = function(fields, fieldRefs) {
			for (var i in fields) {
				formValues[formID] = formValue;
			}
		};
	}*/
	
	
	

	
	if(btnAction == 'btnNote')
	{
		var fields = [
		  { title:'Quick Note', type:'textarea', id:'note', value:''  }
		];
		
	}
	else if(btnAction == 'btnPhoto')
	{
		
		//alert(btnAction);
		var fields = [
		  { title:'Thumbnail', type:'photo', id:'photo', value:''  },
		  { title:'Take a Photo', type:'submit', id:'callCamera' },
		  { title:'From Gallery', type:'submit', id:'callGallery'  }
		];
	}
	
	else
	{
		var fields = [
		  { title:'Quick Note', type:'textarea', id:'note', value:''  }
		];
		
	}
	
	
		
	var fieldsCore = [
		{ title:'Title', type:'text', id:'title', value:'' },
		{ title:'Date For', type:'date', id:'dateFor', value:'', isHidden:true  },
		{ title:'London (click to change)', type:'geoButton', id:'geoButton'},
		{ title:'Tags (separate with a comma)', type:'text', id:'title', value:'' },
		{ title:'Snap (save!)', type:'submit', id:'submitForm'  }
	];
	
	//fields.concat(fieldsSpecific, fieldsCore);
	//var fields = [];
	fields.push.apply(fields, fieldsCore);
	
	//alert(JSON.stringify(fields));
	Ti.API.info(JSON.stringify(fields));
	var fields2 = [
		{ title:'Name', type:'text', id:'name', value:false },
		{ title:'Email', type:'email', id:'email', value:false  },
		{ title:'Address', type:'text', id:'address', value:false  },
		{ title:'City', type:'text', id:'city', value:false  },
		{ title:'State', type:'picker', id:'state', data: [
			'Alabama', 'Alaska', 'Arizona',	'Arkansas',
			'California', 'Colorado', 'Connecticut', 'Delaware',
			'Florida', 'Georgia', 'Hawaii',	'Idaho',
			'Illinois',	'Indiana', 'Iowa', 'Kansas',
			'Kentucky',	'Louisiana', 'Maine', 'Maryland',
			'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
			'Missouri',	'Montana', 'Nebraska', 'Nevada',
			'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
			'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
			'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
			'South Dakota', 'Tennessee', 'Texas', 'Utah',
			'Vermont', 'Virginia', 'Washington', 'West Virginia' 
		], value:false  },
		{ title:'Zip Code', type:'number', id:'zip', value:false  },
		{ title:'Phone', type:'phone', id:'phone', value:false  },
		{ title:'Password', type:'password', id:'password', value:false  },
		{ title:'Birthday', type:'date', id:'birthday', value:false  },
		{ title:'Submit', type:'submit', id:'registerUser', value:false  }
	];
	
	
	var form = forms.createForm({
		style: forms.STYLE_LABEL,
		fields: fields
	});
	
	form.addEventListener('registerUser', function(e) {
		Ti.API.debug(e);
		alert('the magic is here');
	});
	
	win.add(form);
	
	var topBar = new ActionBarView({
		type:data.name,
		pos: 'top'
	});
	
	topBar.addEventListener('close', function() {
		win.close();
	});

	win.add(topBar.viewProxy);
	
	var bottomBar = new ActionBarView({
		pos: 'bottom',
		buttons: {
			btnViewShow: {
				title:'Advanced View',
				width:140,
				visible:false
			},
			btnViewHide: {
				title:'Simple View',
				width:140
			}
		}
	});

	win.add(bottomBar.viewProxy);
	
	bottomBar.addEventListener('buttonPress', function(e) {
		//slide to advanced view
		//start off with showing advanced area on same page
		
		//e.id shows what is being shown;
		
		Ti.API.info(e.id);
		Ti.API.info('---- A');
		Ti.API.info(JSON.stringify(form.children[0]));
		Ti.API.info('---- B');
		var t=form;
		Ti.API.info('---- C');
		var x = JSON.parse(t);
		Ti.API.info('---- D');
		Ti.API.info( x['children'].length );	
		Ti.API.info('---- E');
		var obj = JSON.parse(t);		
		for ( var i in obj) {
			Ti.API.info(obj[i].keepScreenOn + " " + obj[i].children.height);
		}
		
		for (var i = 0, len = form.children.length; i < len; i++) {
			
			//Ti.API.info('height----'+form.children[i].height);
			//Ti.API.info(JSON.stringify(form.children[i]));
			//var x = JSON.parse(form.children[i]);
		//	var y = x.toString();
		//	Ti.API.info('--y--'+y);
			
			
			
			
//			if(x[0].children.isHidden !== 'undefined')
//			{
//				//Ti.API.info(JSON.stringify(form.children[i]));
//				
//				Ti.API.info('do i hide this field '+x[0].children.text+' '+x[0].children.isHidden+' ');
//				
//				//if()
//				form.children[i].hide();
//			}
//			else
//			{
//				Ti.API.info('no ');
//				Ti.API.info('no '+x.text+' '+x.isHidden);
//			}
		}
		
/*		 {"keepScreenOn":false,"children":[{"keepScreenOn":false,"children":[],"top":"10dp","height":"auto","width":"auto","font":{"fontSize":"16dp","fontWeight":"bold"},"color":"#222","left":"35dp","backgroundRepeat":false,"rect":{"height":22,"y":10,"x":35,"width":31},"text":"Title","size":{"height":22,"y":0,"width":31,"x":0}},{"size":{"height":40,"y":0,"width":250,"x":0},"keyboardType":7,"keepScreenOn":false,"top":"5dp","children":[],"height":"40dp","width":"250dp","value":"","color":"#222","backgroundRepeat":false,"rect":{"height":40,"y":37,"x":35,"width":250},"passwordMask":false,"borderStyle":1},{"keepScreenOn":false,"children":[],"top":"10dp","height":"auto","width":"auto","font":{"fontSize":"16dp","fontWeight":"bold"},"color":"#222","left":"35dp","backgroundRepeat":false,"rect":{"height":22,"y":87,"x":35,"width":62},"text":"Date For","size":{"height":22,"y":0,"width":62,"x":0}},{"useSpinner":false,"columns":null,"keepScreenOn":false,"children":[],"backgroundRepeat":false,"rect":{"height":137,"y":109,"x":36,"width":248},"type":1,"size":{"height":137,"y":0,"width":248,"x":0}},{"keepScreenOn":false,"children":[],"top":"10dp","height":"auto","width":"auto","font":{"fontSize":"16dp","fontWeight":"bold"},"color":"#222","left":"35dp","backgroundRepeat":false,"rect":{"height":22,"y":256,"x":35,"width":220},"text":"Tags (separate with a comma)","size":{"height":22,"y":0,"width":220,"x":0}},{"size":{"height":40,"y":0,"width":250,"x":0},"keyboardType":7,"keepScreenOn":false,"top":"5dp","children":[],"height":"40dp","width":"250dp","value":"","color":"#222","backgroundRepeat":false,"rect":{"height":40,"y":283,"x":35,"width":250},"passwordMask":false,"borderStyle":1},{"size":{"height":40,"y":0,"width":100,"x":0}
		 
		 ,"keepScreenOn":false,"children":[],"height":"40dp","width":"100dp","title":"Snap (save!)","backgroundRepeat":false,"rect":{"height":40,"y":333,"x":110,"width":100},"top":"10dp","_events":{"click":{}}}],"top":50,"height":"auto","layout":"vertical","backgroundRepeat":false,"rect":{"height":373,"y":50,"x":0,"width":320},"size":{"height":373,"y":0,"width":320,"x":0}}*/
		
		
		
		//Ti.API.info(JSON.stringify(bottomBar));
		
		for (var i = 0, len = bottomBar.viewProxy.children.length; i < len; i++) {
			//bottomBar.viewProxy.children[i].hide();
			
			//Ti.API.info('------------'+bottomBar.viewProxy.children[i].text);
			//Ti.API.info(JSON.stringify(bottomBar.viewProxy.children[i].children));
			//Ti.API.info(bottomBar.viewProxy.children[i].children.height);
			//Ti.API.info(JSON.stringify(bottomBar.viewProxy.children[i]));
			
		}
		
			//var v = JSON.parse(bottomBar);
			
			//Ti.API.info(v.viewProxy.children[0].children.height);
			//Ti.API.info(v[0].children.text);
		
		
/*		{"size":{"height":44,"y":0,"width":140,"x":0},
		"keepScreenOn":false,"width":140,
		"children":[{"keepScreenOn":false,"children":[],"height":"auto","width":"auto","font":{"fontSize":14,"fontWeight":"bold"},
				"color":"#000000","left":30,"backgroundRepeat":false,
				"rect":{"height":19,"y":12,"x":30,"width":77},
				"text":"Simple View",
				"size":{"height":19,"y":0,"width":77,"x":0}}],
				"right":140,"backgroundRepeat":false,
				"rect":{"height":44,"y":0,"x":40,"width":140},
				"id":"btnViewHide",
				"_events":{"click":{}}}*/

		
/*		{"keepScreenOn":false,
		"children":[],
		"height":"auto","width":"auto",
		"font":{"fontSize":14,"fontWeight":"bold"},
		"color":"#000000","left":30,"backgroundRepeat":false,
		"rect":{"height":19,"y":12,"x":30,"width":77},
		"text":"Simple View",
		"size":{"height":19,"y":0,"width":77,"x":0}}*/

		//bottomBar.btnViewShow.hide();
		//Ti.API.info(bottomBar.btnViewShow.text);
		bottomBar.viewProxy.children.btnViewShow.visibile = false;
		
		//this.btnViewShow.hide();
		//var view = btnViewShow.title;
		//alert(view);
		//galleryInfoView.hide();
		
		
	});
//	qnButton.addEventListener('click', function()
//	{
//		var textSnap = qnText.value;
//		if(textSnap=='')
//		{
//			alert('Note snap can not be empty');
//		}
//		else
//		{
//			var icon = iconPath('note','bottom');
//			var newSnap = {'title':textSnap,'category':'note','rightImage':icon};
//			win.fireEvent('saveSnapAndRefresh_step1', newSnap);
//			win.close();
//		}
//
//	});
//	
//	qnText.focus();
	return win;
}

module.exports = snapForm;