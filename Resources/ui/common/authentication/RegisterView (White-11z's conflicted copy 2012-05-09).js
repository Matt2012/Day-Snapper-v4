function RegisterView() {
	var self = Ti.UI.createView();
	
	var titleLabel = Titanium.UI.createLabel({
	    text:"Sign Up ",
	    height:'auto',
	    width:'auto',
	    top: 25,
	    left: 20,
	    color:'black',
	    font:{fontSize:18, fontWeight: 'bold' },
	    textAlign:'center'
	});
	
	var nameLabel = Titanium.UI.createLabel({
	    text:"First Name: ",
	    height:'auto',
	    width:'auto',
	    top: 45,
	    color:'black',
	    font:{fontSize:14, fontWeight: 'bold' },
	    textAlign:'center'
	});
	
	var nameTextField = Titanium.UI.createTextField({
		color:'#336699',
		height: 'auto',
		width:'95%',
		top:65,
		font:{fontSize:14 },
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	
	
	var label1 = Titanium.UI.createLabel({
	    text:"E-Mail: ",
	    height:'auto',
	    width:'auto',
	    top: 120,
	    color:'black',
	    font:{fontSize:14, fontWeight: 'bold' },
	    textAlign:'center'
	});
	
	var emailTextField = Titanium.UI.createTextField({
		color:'#336699',
		height: 'auto',
		width:'95%',
		hint:"Your email here",
		top:140,
		font:{fontSize:14 },
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	
	if (Titanium.Platform.name != 'android')  {
		emailTextField.height = 35;
	}
	
	var label2 = Titanium.UI.createLabel({
			text:"Password: ",
			height:'auto',
			width:'auto',
			top: 200,
			//left: 20,
			color:'black',
			font:{fontSize:14, fontWeight: 'bold' },
			textAlign:'center'
		});
		
	var passwordTextField = Titanium.UI.createTextField({
		color:'#336699',
		height: 'auto',
		width:'95%',
		//right: 5,
		top:220,
		font:{fontSize:14 },
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		passwordMask:true,
		// keyboardToolbar:[flexSpace,done],
		// keyboardToolbarColor: '#999',   
		// keyboardToolbarHeight: 40,
	});
	
	if (Titanium.Platform.name != 'android')  {
		passwordTextField.height = 35;
	}
	

	
	var signUpButtonArgs = {
			title: "Sign Up",
			color: "white",
			font:{size:"12pt", fontWeight:'bold'},
			height:40,
			width:"90%",
			top: 280,
			//backgroundImage: "none",
			backgroundColor: "#5778FF",
			backgroundFocusedColor: "#7A95FF",
			backgroundSelectedColor: "#7A95FF",
			borderWidth:1,
			borderRadius:10,
			borderColor:'#000'
	};
	
	if (Titanium.Platform.name != 'android')  {
		signUpButtonArgs.backgroundImage = 'none';
	}
	var signUpButton = Titanium.UI.createButton(signUpButtonArgs);
		
	signUpButton.addEventListener('click', function() {
		
		emailTextField.blur();
		passwordTextField.blur();
		
		if( emailTextField.value === "" || passwordTextField.value === "" )
		{
			alert("Please fill in a username & password");
			return; 
		}
		
		var loading = Titanium.UI.createLabel({
			text:"Signing Up, Please wait...",
			width:'auto',
			height:40,
			width:"90%",
			top: 335,
			color:'black',
			font:{fontSize:14, fontWeight: 'bold' },
			textAlign:'center'
		});
		
		signUpButton.hide();
		self.add(loading);


		var Cloud = require('ti.cloud');
		Cloud.debug = true;  // optional; if you add this line, set it to false for production

		Cloud.Users.create({
			username: emailTextField.value,
			password: passwordTextField.value,
			first_name: nameTextField.value,
			password_confirmation: passwordTextField.value
		}, function (e) {
			  if (e.success) {
					  Ti.API.info("Successfully created a new user with id: " + e.users.id);
					  Ti.API.info( "Logged In as: " + e.users.first_name );
					  Ti.App.Properties.setProperty('userID',e.users.id);
					  Ti.App.Properties.setProperty('userName',e.users.first_name);
					  self.fireEvent('loggedIn',e.users);
			  } else {
				  	  // oops, something went wrong	
					  Ti.API.info("Could not create new user. ErrorCode: " + e.code+ e.message);
					  alert(e.message);
					  signUpButton.show();
					  loading.hide();
				    }
			});
	});
	
	self.add(titleLabel);
	self.add(nameLabel);
	self.add(nameTextField);
	self.add(label1);
	self.add(emailTextField);
	self.add(label2);
	self.add(passwordTextField);
	self.add(signUpButton);
	
	
	return self;
};

module.exports = RegisterView;