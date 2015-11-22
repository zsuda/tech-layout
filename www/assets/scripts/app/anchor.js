anchor = {
	clearHash: null,
	menuItems: null,

	__prepareVars: function() {
		this.menuItems = 'header nav a';
	},

	__listeners: function() {
		var _self = this;

		$(document).on('click', 'a[href*=#]', function(e) {
			e.preventDefault();

			_self.clearHash = $(this).attr('href').replace('#','');
			_self.scrollToSection(_self.clearHash);
		});
	},

	scrollToSection: function(hash) {
		var _self = this;
		this.clearHash = hash.replace('#_', '');

		$('html,body').animate({scrollTop: $('#' + this.clearHash).offset().top}, 'slow', function(){
			window.location.hash = '#_' + _self.clearHash;
		});
		this.setMenuItemActive();
	},

	setMenuItemActive: function() {
		$(this.menuItems).removeClass('active');
		$(this.menuItems + '[href*=' + this.clearHash + ']').addClass('active');
	},

	init: function() {
		if(window.location.hash != '') {
			this.scrollToSection(window.location.hash);
		}

		this.__prepareVars();
		this.__listeners();
	}
};

module.exports = anchor;