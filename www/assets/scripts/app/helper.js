var helper = {
	windowWidth: function() {
		return $(window).width();
	},

	scrollTop: function() {
		return $(window).scrollTop();
	},

	windowHeight: function() {
		return $(window).height();
	}
};

module.exports = helper;