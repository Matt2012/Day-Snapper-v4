function LoginView() {
	
	var self = Ti.UI.createView();
	
	var titleLabel = Titanium.UI.createLabel({
		text:"Login",
		height:'auto',
		width:'auto',
		top: 25,
		left: 20,
		color:'black',
		font:{fontSize:18, fontWeight: 'bold' },
		textAlign:'center'
	});
	
	var label1 = Titanium.UI.createLabel({
		text:"E-Mail: ",
		height:'auto',
		width:'auto',
		top: 45,
		color:'black',
		font:{fontSize:14, fontWeight: 'bold' },
		textAlign:'center'
	});
		
	var emailTextField = Titanium.UI.createTextField({
		color:'#336699',
		height:'auto',
		width:'95%',
		top:65,
		font:{fontSize:14 },
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	});
	
	if (Titanium.Platform.name != 'android')  {
		emailTextField.height = 35;
	}
	
	var label2 = Titanium.UI.createLabel({
		text:"Password: ",
		height:'auto',
		width:'auto',
		top: 120,
		color:'black',
		font:{fontSize:14, fontWeight: 'bold' },
		textAlign:'center'
	});
		
	var passwordTextField = Titanium.UI.createTextField({
		color:'#336699',
		height:'auto',
		width:'95%',
		top:140,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		passwordMask:true
	});
	
	if (Titanium.Platform.name != 'android')  {
		passwordTextField.height = 35;
	}
	
	var loginButtonArgs = {
		title: "Log In",
		color: "white",
		font:{size:"12pt", fontWeight:'bold'},
		height:40,
		width:"90%",
		top:200,
		backgroundColor: "#5778FF",
		backgroundFocusedColor: "#7A95FF",
		backgroundSelectedColor: "#7A95FF",
		borderWidth:1,
		borderRadius:10,
		borderColor:'#000'
	};
	
	if (Titanium.Platform.name != 'android')  {
		loginButtonArgs.backgroundImage = 'none';
	}
	var loginButton = Titanium.UI.createButton(loginButtonArgs);
		
	loginButton.addEventListener('click', function() {
		emailTextField.blur();
		passwordTextField.blur();
		if( emailTextField.value === "" || passwordTextField.value === "" )
		{			
			alert("Please fill in a username & password");
			return false;
		}
		
		Ti.API.info("Running Test: PFUser Login");
		
		var loading = Titanium.UI.createLabel({
			text:"Logging In, Please wait...",
			width:'auto',
			height:40,
			width:"90%",
			top: 335,
			color:'black',
			font:{fontSize:14, fontWeight: 'bold' },
			textAlign:'center'
		});
		
		loginButton.hide();
		self.add(loading);
		
		var Cloud = require('ti.cloud');
		Cloud.debug = true;  // optional; if you add this line, set it to false for production

		Cloud.Users.login({
			login: emailTextField.value,
			password: passwordTextField.value
		}, function (e) {
			if (e.success) {
				var user = e.users[0];
				Ti.API.info( "Logged In as: " + user.username ); // show the logged in user
				Ti.API.info("User ---- "+JSON.stringify(user));
				Ti.App.Properties.setProperty('firstName',user.first_name);
				Titanium.App.Properties.setList(user.id,user);
				Titanium.App.Properties.setString('userName',user.username);
				Titanium.App.Properties.setString('userID',user.id);
				Titanium.App.Properties.setString('loggedIn',true);
				self.fireEvent('loggedIn',user);	
			} else {
				alert('Error:\\n' +
					((e.error && e.message) || JSON.stringify(e)));	
				Ti.API.info("Could not login with credentials. ErrorCode: " + e.code + " Error: " + e.message);
				loginButton.show();
				loading.hide();	
			}
		});
				
	});
	
	self.add(titleLabel);
	self.add(label1);
	self.add(emailTextField);
	self.add(label2);
	self.add(passwordTextField);
	self.add(loginButton);
	
	return self;
}

module.exports = LoginView;
