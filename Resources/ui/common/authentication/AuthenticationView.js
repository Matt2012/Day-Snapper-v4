function AuthenticationView() {
	
	Ti.include('/lib/ti/global.js');

	var ActionBarView = require('/ui/common/shared/ActionBarView');
		
	var self = new ui.View({
		backgroundColor:'white'
	});
	
	var LoginView = require('/ui/common/authentication/LoginView');
	var RegisterView = require('/ui/common/authentication/RegisterView');
	var EmailPasswordView = require('/ui/common/authentication/EmailPasswordView');

	var loginV = new LoginView();
	var registerV = new RegisterView();
	var passwordV = new EmailPasswordView();

    var scrollView = Ti.UI.createScrollableView({
		top:44,
		left:0,
		right:0,
		bottom:44,
		views:[loginV, registerV, passwordV],
		showPagingControl:false
	});
 
    self.add(scrollView);
	
	loginV.addEventListener('loggedIn', function(user) {
		self.fireEvent('authenticated',user)
		return false;
	});
	
	registerV.addEventListener('loggedIn', function(user) {
		self.fireEvent('authenticated',user);
		return false;
	});
	
	scrollView.addEventListener('scroll', function(e) {
		//alert('change buttons'+e.index);
		//switch
		//change buttons (show hide);
		switch(e.index)
		{
			case 0:
				//button.register.width = 120;
				//button.login.width = 0;
			break;
			default:
				//button.register.width = 0;
				//button.login.width = 120;
			break;
		}
	});
	
	
	var topBar = new ActionBarView({
		pos: 'top',
		buttons: {
			register: {
				title:'Register',
				width:120
			}
		}
	});

	self.add(topBar.viewProxy);
	
	topBar.addEventListener('buttonPress', function(e) {
		switch(e.id)
		{
			case'register':
				var goPage = 1.0;
			break;
			case'login':
				var goPage = 0.0;
			break;
		}
		//switch statement
		scrollView.scrollToView(goPage);
	});
	
	var bottomBar = new ActionBarView({
		pos: 'bottom',
		buttons: {
			password: {
				title:'Password Reminder',
				width:180
			}
		}
	});

	self.add(bottomBar.viewProxy);
	
	bottomBar.addEventListener('buttonPress', function(e) {
		scrollView.scrollToView(2.0);
	});
	
	return self;
};

module.exports = AuthenticationView;