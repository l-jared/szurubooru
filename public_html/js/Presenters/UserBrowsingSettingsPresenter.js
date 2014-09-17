var App = App || {};
App.Presenters = App.Presenters || {};

App.Presenters.UserBrowsingSettingsPresenter = function(
	_,
	jQuery,
	util,
	promise,
	auth,
	browsingSettings,
	messagePresenter) {

	var target;
	var template;
	var user;
	var privileges = {};

	function init(args, loaded) {
		user = args.user;
		target = args.target;

		privileges.canChangeBrowsingSettings = auth.isLoggedIn(user.name) && user.name === auth.getCurrentUser().name;

		promise.wait(util.promiseTemplate('browsing-settings'))
			.then(function(html) {
				template = _.template(html);
				render();
				loaded();
			});
	}

	function render() {
		var $el = jQuery(target);
		$el.html(template({user: user, settings: browsingSettings.getSettings()}));
		$el.find('form').submit(browsingSettingsFormSubmitted);
	}

	function browsingSettingsFormSubmitted(e) {
		e.preventDefault();
		var $el = jQuery(target);
		var $messages = $el.find('.messages');
		messagePresenter.hideMessages($messages);

		var newSettings = {
			endlessScroll: $el.find('[name=endless-scroll]').is(':checked'),
			hideDownvoted: $el.find('[name=hide-downvoted]').is(':checked'),
			listPosts: {
				safe: $el.find('[name=listSafePosts]').is(':checked'),
				sketchy: $el.find('[name=listSketchyPosts]').is(':checked'),
				unsafe: $el.find('[name=listUnsafePosts]').is(':checked'),
			},
		};

		browsingSettings.setSettings(newSettings)
			.then(function() {
				messagePresenter.showInfo($messages, 'Browsing settings updated!');
			});
	}

	function getPrivileges() {
		return privileges;
	}

	return {
		init: init,
		render: render,
		getPrivileges: getPrivileges,
	};

};

App.DI.register('userBrowsingSettingsPresenter', ['_', 'jQuery', 'util', 'promise', 'auth', 'browsingSettings', 'messagePresenter'], App.Presenters.UserBrowsingSettingsPresenter);
