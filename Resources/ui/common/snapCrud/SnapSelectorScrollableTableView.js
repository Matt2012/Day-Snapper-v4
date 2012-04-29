function SnapSelectorScrollableTableView() {
	
	Ti.include('/lib/ti/global.js');
	
	var self = Ti.UI.createView({
		backgroundColor:'#FFFFFF',
		top:44,
		bottom:44,
	});

	//save this to Taffy on first run // check for updates from server
	var noteIcon = iconPath('note','bottom');
	var photoIcon = iconPath('camera','bottom');
	var voiceIcon = iconPath('voice','bottom');
	var videoIcon = iconPath('video','bottom');
	var galleryIcon = iconPath('note','bottom');
	var blogIcon = iconPath('note','bottom');
	var journalIcon = iconPath('note','bottom');
	var doobeeIcon = iconPath('note','bottom');
	var locationIcon = iconPath('note','bottom');
	var alarmIcon = iconPath('note','bottom');
	var moodIcon = iconPath('note','bottom');
	var moneyIcon = iconPath('note','bottom');
	var exerciseIcon = iconPath('note','bottom');
	var trackerIcon = iconPath('note','bottom');
	
	var ar = [{"title":"Quick Note", "id":"btnNote", "rightImage":noteIcon},
		{"title":"Photo Snap", "id":"btnPhoto", "rightImage":photoIcon},
		{"title":"Voice Snap", "id":"btnVoice", "rightImage":voiceIcon},
		{"title":"Video Snap", "id":"btnVideo", "rightImage":videoIcon},
		{"title":"Snap from Gallery", "id":"btnGallery", "rightImage":galleryIcon},
		{"title":"Public Blog Snap", "id":"btnBlog", "rightImage":blogIcon},
		{"title":"Private Journal Snap", "id":"btnJournal", "rightImage":journalIcon},
		{"title":"Make a DooBee Snap", "id":"btnDooBee", "rightImage":doobeeIcon},
		{"title":"Post discussion to TribeTree", "id":"btnAlarm", "rightImage":noteIcon},
		{"title":"Add to PicWiki.org: Social wikipedia of images", "id":"btnAlarm", "rightImage":noteIcon},
		{"title":"Quick Location Snap", "id":"btnLocation", "rightImage":locationIcon},
		{"title":"Quick Reminder Snap", "id":"btnAlarm", "rightImage":alarmIcon},
		{"title":"Post Status Update and Share (Facebook)", "id":"btnTextShare", "rightImage":photoIcon},
		{"title":"Take Photo and Share Online", "id":"btnPhotoShare", "rightImage":photoIcon},
		{"title":"Write Review and Share (LoveHateRate.It)", "id":"btnReview", "rightImage":noteIcon},
		{"title":"Money Tracker: Record an expense", "id":"btnMoney", "rightImage":moneyIcon},
		{"title":"Mood Tracker: Record an emotion", "id":"btnMood", "rightImage":moodIcon},
		{"title":"Sports Tracker: Record an exercise", "id":"btnExercise", "rightImage":exerciseIcon},
		{"title":"Generic Quantative Tracker: Track any amount of any measure", "id":"btnTracker", "rightImage":trackerIcon}
		];
		
	var table = Ti.UI.createTableView({
		data:ar,
		color:'#999'
	});
	self.add(table);
	
	//add behavior
	table.addEventListener('click', function(e) {
		//alert(e.rowData.title);
		self.fireEvent('itemSelected', {
			//could also pass whether to pull data from TAFFY
			name:e.rowData.title,
			id:e.rowData.id
		});
	});
	
	return self;
};

module.exports = SnapSelectorScrollableTableView;