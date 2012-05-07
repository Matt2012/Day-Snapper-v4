function detailWindow(args) {

	Ti.include('/lib/ti/global.js');
	
	Ti.include('/ui/common/snapCrud/selectorActions.js');

	var ActionBarView = require('/ui/common/shared/ActionBarView');
	
	var data = args.data;
	var win = args.win;
	
	var self = new ui.Window({
		backgroundColor:'white',
		modal:true,
		navBarHidden:true
	});
	

	var detailView = DetailView();
	
	detailView.fireEvent('prepareView',data);
	
	self.add(detailView);

	var topBar = new ActionBarView({
		type:'View Snap',
		pos: 'top'
	});
	
	topBar.addEventListener('close', function() {
		self.close();
	});

	self.add(topBar.viewProxy);
	
	
	var bottomBar = new ActionBarView({
		pos: 'bottom',
		buttons: {
			btnEdit: {
				icon:'edit',
				width:80
			},
			btnTag: {
				icon:'tag',
				width:80
			},
			btnArchive: {
				icon:'archive',
				width:80
			},
			btnDelete: {
				icon:'delete',
				width:80
			}
		}
	});

	self.add(bottomBar.viewProxy);
	
	bottomBar.addEventListener('buttonPress', function(e) {
		//e.id Tells us what button was pressed.
		//alert('a'+JSON.stringify(detailView.data['snap']['___id']));
		//alert('b'+JSON.stringify(detailView.data.snap));
		
		if(e.id=='btnEdit')
		{
			//send all data back 
			Ti.API.info('----------edit snap using '+JSON.stringify(detailView.data));
			var data = detailView.data;
		}
		else
		{
			//used for archiving / deleting record (tableRow, taffyID and post_id)
			Ti.API.info('----------archive or delete using '+JSON.stringify(detailView.keys));
			var data = detailView.keys;
		}
		doAction('ModifySnap', e.id, self, data);
	});
	
    //Modify Snap and Close relevant windows and refresh table
	self.addEventListener('updateSnap_passBack_step2', function(updatedSnap) {
		Ti.API.info('------------updateSnap_passBack_step2-------------');
		win.fireEvent('updateSnap_updateTableRowUpdateTaffy_step2',updatedSnap); //on SnapsScrollableTableView.js update table view
		self.close();
	});

	return self;
}


function doTags(tagString, tagScroller)
{	
	for(var c=tagScroller.children.length-1;c >= 0; c-- ) {
        tagScroller.remove( tagScroller.children[c] );
    }
	
	var tagContainer = Ti.UI.createView({
		layout:'horizontal',
		height:'50dp',
		width:'auto',
		textAlign:'left',
		top:0
	});
	tagScroller.add(tagContainer);
		
	if( typeof tagString==='undefined'||tagString=='') return false;
    var tags = tagString.replace(/ /g,'').split(',');
	for (i in tags){
      var tagChain = Titanium.UI.createLabel({text:tags[i],backgroundColor:'#DDD',borderRadius:5, left:5});
	  tagContainer.add(tagChain);
	}
	tagScroller.add(tagContainer);
	//return;
}

function DetailView() {
	var moment = require('/lib/thirdParty/moment.min');
	//Ti.include('../../lib/ti/global.js');
	//var win = Ti.UI.currentWindow;
	
	var self = Ti.UI.createScrollView({
		backgroundColor:'#CCCCCC',
        layout: 'vertical',
		height: Ti.UI.SIZE,
		width:Ti.UI.SIZE
	});
	
	var lbTitle = Ti.UI.createLabel({
		top:65,
		bottom:65,
		left:20,
		height:'auto',
		width:'auto',
		color:'#000'
	});
	self.add(lbTitle);
	
	
	var lbDate1 = Ti.UI.createLabel({
		height:'auto',
		width:'auto',
		/*top:10,*/
		left:20,
		color:'#000'
	});
	self.add(lbDate1);

	var tagScroller = Ti.UI.createScrollView({
		scrollType:'horizontal',
		top:10,
		left:'10dp',
		contentWidth:'auto'
	});
	self.add(tagScroller);	
	

	self.addEventListener('prepareView', function(data) {
		var d0 = moment(data.dateFor);
		var d1 = d0.format("dddd, MMMM Do YYYY, h:mm a");
		lbTitle.text = data.content;
		lbDate1.text = d1;
		Ti.API.info('-------whats been passed to detail view '+JSON.stringify(data));
		var keys = {'tableRow':data.tableRow,'uid':data.uid,'post_id':data.post_id};
		self.keys = keys;
		self.data = data;
		doTags(data.tags_array, tagScroller);
	});
 
	return self;
}

module.exports = detailWindow;