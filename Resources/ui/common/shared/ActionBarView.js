function ActionBarView(args) {
	
	Ti.include('/lib/ti/global.js');

	if(typeof args.pos !== 'undefined' && args.pos === 'top')
	{
		var labelColour = '#DDDDDD';
		var barBorderTop = 43;
		
		var self = new ui.Component(new ui.View({
			height:44,
			backgroundColor:'#F1F1F1',
			top:0
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
			height:44,
			backgroundColor:'#F1F1F1',
			bottom:0
		}));
		
	}

	var barBorder = Ti.UI.createView({
        height: 1,
        width: '100%',
        backgroundColor: '#ccc',
        top:barBorderTop
    });
    self.add(barBorder);
	
	


	//title label or image if none provided
	if (args.title) {
		self.add(new ui.Label(args.title, _.extend({
			left:5
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
					 var btnBackView = new ui.View({
						left:0,
						width:45
					});
					
					var btnBackImage1 = new ui.ImageView(iconPath('holo-back','top'),{
						left:2,
						height:12,
						width:7
					});
					
					var btnBackImage2 = new ui.ImageView(iconPath('appIcon','top'),{
						left:12,
						height:30,
						width:30
					});
					
					btnBackView.add(btnBackImage1);
					
					btnBackView.add(btnBackImage2);
				
					btnBackView.addEventListener('click', function(e) {
						self.fireEvent('close');
					});
					
					self.add(btnBackView);
					
					var tr = Ti.UI.create2DMatrix();
					tr = tr.rotate(353);

					windowLabel = new ui.Label(args.type, {
					  color:labelColour,
					  bottom:0,
					  left:45,
					  height:60,
					  font:{fontSize:40},
					  textAlign:'left',
					  transform:tr
					});
					self.add(windowLabel);
				}
			}
			else
			{
				self.add(new ui.ImageView('../../images/appc_white.png', {
					left:5,
					width:161,
					height:32
				}));
			}
		}
	}
	
	var buttonOffset = 0;
	for (var buttonId in args.buttons) {
		var buttonData = args.buttons[buttonId];
		
		var btnLabel, btnImage, button = new ui.View({
			width:buttonData.width,
			right:buttonOffset,
			id:buttonId
		});
		
		//alert(buttonId);
		Ti.API.info(buttonId);
		
		if (buttonData.title) {
			btnLabel = new ui.Label(buttonData.title, {
				color:labelColour,
				height:'auto',
				width:'auto',
				left:30,
				
				font: {
					fontSize:14,
					fontWeight:'bold'
				}
			});
			button.add(btnLabel);
		}
		else if (buttonData.icon) {
			var btnImage = new ui.ImageView(iconPath(buttonData.icon,args.pos),{
				height:20,
				width:20
			});

			if(buttonData.icon=='sync')
			{
				var a = Titanium.UI.createAnimation();
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
		
		if(args.pos=='top')
		{
			self.add(new ui.View({
				backgroundColor:'#dedede',
				width:1,
				height:42,
				right:buttonOffset+buttonData.width
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
	
	return self;
}

module.exports = ActionBarView;