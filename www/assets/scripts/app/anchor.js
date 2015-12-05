anchor = {
	isAnimated: false,
	classActive: 'active',
	clearHash: null,
	hash: window.location.hash,
	tempHash: null,
	scrollTop: 0,
	menuItem: null,
	headerHeight: 0,

	section: null,

	__prepareVars: function() {
		this.scrollTop = helper.scrollTop();
		this.menuItem = '.menu a';
		this.header = '.header';

		this.headerHeight = $(this.header).outerHeight();

		this.__addListeners();
	},

	__addListeners: function() {
		var _self = this;

		$(document).on('click', _self.menuItem, function(e) {
			e.preventDefault();

			_self.hash = $(this).attr('href');
			_self.__setClearHash();
			_self.__setTempHash();
			_self.__setActiveMenuItem();
			_self.isAnimated = true;
			_self.scrollToSection();
		});

		$(window).on('scroll', function() {
			_self.scrollTop = helper.scrollTop();
			_self.__getVisibleSection();
		});

		$(window).on('resize', function() {
			_self.headerHeight = $(_self.header).outerHeight();
		});
	},

	__setClearHash: function() {
		if(this.hash.indexOf('#_') > -1) {
			this.clearHash = this.hash.replace('#_', '');
		}
		else {
			this.clearHash = this.hash.replace('#', '');
		}
	},

	__setActiveMenuItem: function(setActive) {
		if(setActive) {
			$(this.menuItem).first().addClass(this.classActive);
		}
		else {
			$(this.menuItem).removeClass(this.classActive);
			$(this.menuItem + '[href*=' + this.clearHash + ']').addClass(this.classActive);
		}
	},

	__setTempHash: function() {
		window.location.hash = '#_' + this.clearHash;
	},

	scrollToSection: function() {
		var _self = this;
		var offset = $('#' + this.clearHash).offset().top - _self.headerHeight;

		$('html,body').animate({scrollTop: offset}, 'slow', function(){
			_self.isAnimated = false;
		});
	},

	__getVisibleSection: function() {
		var _self = this;
		var closest = 0;
		var next = 0;
		var visibleSection = 'question';
		var nextSection = null;

		if(_self.isAnimated === false)
		{
			$('section').each(function(index)
			{
				if(helper.scrollTop() > $(this).offset().top - _self.headerHeight - 5)
				{
					closest = index;
				}

				if(helper.scrollTop() > $(this).offset().top)
				{
					next = index + 1;
				}
			});

			visibleSection = $('section').eq(closest).attr('id');
			nextSection = $('section').eq(next).attr('id');

			if(_self.section !== visibleSection)
			{
				_self.section = visibleSection;
				_self.clearHash = visibleSection;
				_self.__setActiveMenuItem();
				_self.__setTempHash();
				var positionLeft = $(window.cursorFollower.activeItem).parents('li').position().left;
				var width = $(window.cursorFollower.activeItem).outerWidth();
				$(window.cursorFollower.animateBorder(positionLeft, width));
			}
		}
	},

	init: function() {
		this.__prepareVars();

		if(window.location.hash == '') {
			this.__setActiveMenuItem(true);
		}
		else {
			this.__setClearHash();
			this.__setTempHash();
			this.__setActiveMenuItem();
			this.scrollToSection();
		}
	}
};

module.exports = anchor;