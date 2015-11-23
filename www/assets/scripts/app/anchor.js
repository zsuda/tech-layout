anchor = {
	clearHash: null,
	menuItems: null,
	headerOffset: 0,
	isAnimated: false,

	__prepareVars: function() {
		this.menuItems = 'header nav a';

		this.setHeaderOffset();
	},

	__listeners: function() {
		var _self = this;

		$(document).on('click', 'a[href*=#]', function(e) {
			e.preventDefault();

			if(_self.isAnimated == false) {
				_self.isAnimated = true;
				_self.clearHash = $(this).attr('href').replace('#','');
				_self.scrollToSection(_self.clearHash);
			}
		});

		$(window).on('resize', function() {
			_self.setHeaderOffset();
		});
	},

	setHeaderOffset: function() {
		if(window.helper.windowWidth() < 990) {
			this.headerOffset = 88;
		}
		else {
			this.headerOffset = 0;
		}
	},

	scrollToSection: function(hash) {
		var _self = this;
		this.clearHash = hash.replace('#_', '');

		var offset = $('#' + this.clearHash).offset().top;

		$('html,body').animate({scrollTop: offset}, 'slow', function(){
			window.location.hash = '#_' + _self.clearHash;
			_self.isAnimated = false;
		});
		this.setMenuItemActive();
	},

	setMenuItemActive: function() {
		$(this.menuItems).removeClass('active');
		if(this.clearHash != 'home') {
			$(this.menuItems + '[href*=' + this.clearHash + ']').addClass('active');
		}
		else {
			$(this.menuItems).first().addClass('active');
		}
	},

	init: function() {
		this.__prepareVars();
		this.setHeaderOffset();

		if((window.location.hash != '')) {
			this.scrollToSection(window.location.hash);
			$(this.menuItems + '[href*=' + window.location.hash + ']').addClass('active');
		}
		else {
			$(this.menuItems).first().addClass('active');
		}

		this.__listeners();
	}
};

module.exports = anchor;