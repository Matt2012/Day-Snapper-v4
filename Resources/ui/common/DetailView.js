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
	

	self.addEventListener('prepareView', function(e) {
		var d0 = moment(e.snap.dateFor);
		var d1 = d0.format("dddd, MMMM Do YYYY, h:mm a");
		lbTitle.text = e.snap.content;
		lbDate1.text = d1;
		doTags(e.snap.tags_array, tagScroller);
	});
 
	return self;
};
module.exports = DetailView;