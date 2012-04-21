function TagSelectorScrollableTableView() {
	
	var self = Ti.UI.createView({
		backgroundColor:'#FFFFFF',
		top:44,
		height:375
	});

	var ar = [{"title":"Street Art", "price":"1.00", "status":"live", "hasChild":true},
		{"title":"Family Pics", "price":"1.50", "status":"live", "hasChild":true},
		{"title":"Friends", "price":"2.50", "status":"live", "hasChild":true},
		{"title":"Work Notes", "price":"1.50", "status":"archive", "hasChild":true},
		{"title":"My Great Ideas", "price":"1.40", "status":"live", "hasChild":true},
		{"title":"Scap Book", "price":"1.00", "status":"live", "hasChild":true}];
		
	var table = Ti.UI.createTableView({
		data:ar,
		height:375,
		color:'#999'
	});
	self.add(table);
	
	//add behavior
	table.addEventListener('click', function(e) {
		//alert(e.rowData.title);
		self.fireEvent('itemSelected', {
			name:e.rowData.title,
			price:e.rowData.price
		});
	});
	
	return self;
};

module.exports = TagSelectorScrollableTableView;