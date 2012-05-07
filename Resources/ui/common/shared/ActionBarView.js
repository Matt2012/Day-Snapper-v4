function ActionBarView(args) {
	
	Ti.include('/lib/ti/global.js');
	
	var buttonRefs = {};

	if(typeof args.pos !== 'undefined' && args.pos === 'top')
	{
		var labelColour = '#DDDDDD';
		var barBorderTop = GetHeight(43);
		
		var self = new ui.Component(new ui.View({
			height:GetHeight(44),
			backgroundColor:'#F1F1F1',
			top:GetHeight(0)
		}));
		
//		var backbutton = Titanium.UI.createButton({ backgroundImage:'images/.png', width:48, height:27 }); 
//		
//		backbutton.addEventListener('click', function() { win.close(); }); 
//		
//		self.leftNavButton = backbutton; 
		
		
	}
	else
	{
		args.pos = 'bottom';
		var labelColour = '#000000';
		var barBorderTop = 0;
		
		var self = new ui.Component(new ui.View({
			height:GetHeight(44),
			backgroundColor:'#F1F1F1',
			bottom:0
		}));
		
	}

	var barBorder = Ti.UI.createView({
        height: GetHeight(1),
        width:Ti.UI.SIZE,
        backgroundColor: '#ccc',
        top:GetHeight(barBorderTop)
    });
    self.add(barBorder);
	
	


	//title label or image if none provided
	if (args.title) {
		self.add(new ui.Label(args.title, _.extend({
			left:GetWidth(5)
		},theme.headerText)));
	}
	else {
		if(args.pos=='top')
		{
			//add drop down picker here
			if(typeof args.type !== 'undefined' )
			{
				
				Ti.API.info("--------------------------Top Options: " + args.type);
				
				if(args.type=='MasterView')
				{
					//defaults to drop down
				}
				else
				{
					//Add Back Button
					if (Ti.Platform.osname === 'android') {
						//use android 'holo' style back button					
						 var btnBackView = new ui.View({
							left:0,
							width:GetWidth(45)
						});
						
						var btnBackImage1 = new ui.ImageView(iconPath('holo-back','top'),{
							left:GetWidth(2),
							height:GetHeight(12),
							width:GetWidth(7)
						});
						
						var btnBackImage2 = new ui.ImageView(iconPath('appIcon','top'),{
							left:GetWidth(12),
							height:GetHeight(30),
							width:GetWidth(30)
						});
						
						btnBackView.add(btnBackImage1);
						
						btnBackView.add(btnBackImage2);
					
						btnBackView.addEventListener('click', function(e) {
							self.fireEvent('close');
							Ti.API.info('------------close window');
							//self.close();
						});
						
						self.add(btnBackView);
						
						var tr = Ti.UI.create2DMatrix();
						tr = tr.rotate(353);
	
						windowLabel = new ui.Label(args.type, {
						  color:labelColour,
						  bottom:0,
						  left:GetWidth(45),
						  height:GetHeight(60),
						  font:{fontSize:40},
						  textAlign:'left',
						  transform:tr
						});
						self.add(windowLabel);
					}
					else
					{
						//Use iOS system nav back button
						var closeButton = Ti.UI.createButton({
							title:L('done'),
							style:Ti.UI.iPhone.SystemButtonStyle.BORDERED
						});
						
						closeButton.addEventListener('click', function() {
							self.close();
						});
						
						self.rightNavButton = closeButton;
					}
					
				}
			}
			else
			{
				self.add(new ui.ImageView('../../images/appc_white.png', {
					left:GetWidth(5),
					width:GetWidth(161),
					height:GetHeight(32)
				}));
			}
		}
	}
	
	var buttonOffset = 0;
	var i = 0;
	for (var buttonId in args.buttons) {
		i++;
		var buttonData = args.buttons[buttonId];
		
		var btnLabel, btnImage, button = new ui.View({
			width:GetWidth(buttonData.width),
			right:GetWidth(buttonOffset),
			id:buttonId
		});
		
		//alert(buttonId);
		//Ti.API.info(buttonId);
		if (buttonData.title) {
			btnLabel = new ui.Label(buttonData.title, {
				color:labelColour,
				height:'auto',
				width:'auto',
				left:GetWidth(30),
				id:buttonId||buttonData.title,
				font: {
					fontSize:14,
					fontWeight:'bold'
				}
			});
			button.add(btnLabel);
		}
		else if (buttonData.icon) {
			var btnImage = new ui.ImageView(iconPath(buttonData.icon,args.pos),{
				height:GetHeight(20),
				width:GetWidth(20)
			});

			if(buttonData.icon=='sync')
			{
				var a = Ti.UI.createAnimation();
				var t = Ti.UI.create2DMatrix();
	
				btnImage.addEventListener('click', function(e) {
					for(i=0;i<1000;i++)
					{
						t = t.rotate(90);
						a.transform = t;
						a.duration = 1000;
						btnImage.animate(a);
					}
				});
				
				btnImage.addEventListener('stopSpin', function(e) {
					//t = t.rotate(0);
					//a.transform = t;
					//a.duration = 1;
					//btnImage.animate(a);
					btnImage.remove();
					button.add(btnImage);
				});
			}

			button.add(btnImage);
			
		}

		self.add(button);
		buttonRefs[buttonId] = button;
		
		if(args.pos=='top' && buttonData.title)
		{
			self.add(new ui.View({
				backgroundColor:'#dedede',
				width:GetWidth(1),
				height:GetHeight(42),
				right:GetWidth(buttonOffset+buttonData.width)
			}));
		}
		
		(function(id, btn) {
			btn.addEventListener('click', function() {
				self.fireEvent('buttonPress', {
					id:id
				});
			});
		})(buttonId, button);
		
		buttonOffset = buttonOffset+buttonData.width;
	}
	
	self.buttonRefs = buttonRefs;
	return self;
}

module.exports = ActionBarView;