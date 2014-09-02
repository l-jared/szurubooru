var App = App || {};
App.Presenters = App.Presenters || {};

App.Presenters.LoginPresenter = function(
	jQuery,
	util,
	topNavigationPresenter,
	messagePresenter,
	auth,
	router,
	appState) {

	topNavigationPresenter.select('login');

	var $el = jQuery('#content');
	var $messages;
	var template;

	util.loadTemplate('login-form').then(function(html) {
		template = _.template(html);
		init();
	});

	function init() {
		if (appState.get('loggedIn'))
			router.navigateToMainPage();
		else
			render();
	}

	function render() {
		$el.html(template());
		$el.find('form').submit(loginFormSubmitted);
		$messages = $el.find('.messages');
		$messages.width($el.find('form').width());
	};

	function loginFormSubmitted(e) {
		e.preventDefault();
		messagePresenter.hideMessages($messages);

		var userName = $el.find('[name=user]').val();
		var password = $el.find('[name=password]').val();
		var remember = $el.find('[name=remember]').val();

		//todo: client side error reporting

		auth.loginFromCredentials(userName, password, remember)
			.then(function(response) {
				router.navigateToMainPage();
				//todo: "redirect" to main page
			}).catch(function(response) {
				messagePresenter.showError($messages, response.json && response.json.error || response);
			});
	}

	return {
		render: render,
	};

};

App.DI.register('loginPresenter', App.Presenters.LoginPresenter);