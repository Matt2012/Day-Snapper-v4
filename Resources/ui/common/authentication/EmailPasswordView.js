function EmailPasswordView() {
	var self = Ti.UI.createView();
	
	var lbl = Ti.UI.createLabel({
		text:'Email Password View',
		height:'auto',
		width:'auto',
		color:'#000'
	});
	self.add(lbl);
	
	return self;
};

module.exports = EmailPasswordView;
