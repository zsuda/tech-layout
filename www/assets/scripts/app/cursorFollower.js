cursorFollower = {
	menu: null,
	item: null,
	activeItem: null,
	border: null,
	left: 0,
	width: 0,
	lastLeft: 0,
	lastWidth: 0,

	__prepareVars: function() {
		this.menu = '.header nav ul';
		this.item = this.menu + ' a';
		this.activeItem = this.menu + ' a.active';

		this.appendBorder();
		this.setDefaultPosition();
		this.__listeners();
	},

	__listeners: function() {
		var _self = this;

		$(document).on('mouseenter', this.item, function() {
			_self.lastLeft = $(_self.activeItem).parents('li').position().left;
			_self.lastWidth = $(_self.activeItem).parents('li').outerWidth();
			_self.left = $(this).parents('li').position().left;
			_self.width = $(this).parents('li').outerWidth();

			_self.animateBorder(_self.left, _self.width);
		});

		$(document).on('mouseleave', this.menu, function() {
			_self.animateBorder(_self.lastLeft, _self.lastWidth);
		});

		$(document).on('click', this.item, function() {
			_self.lastLeft = _self.left = $(this).parents('li').position().left;
			_self.lastWidth = _self.width = $(this).parents('li').outerWidth();
			_self.animateBorder(_self.left, _self.width);
		});

		$(document).on('click', '.logo a', function() {
			_self.lastLeft = _self.left = $(_self.activeItem).parents('li').position().left;
			_self.lastWidth = _self.width = $(_self.activeItem).parents('li').outerWidth();



			_self.animateBorder(_self.left, _self.width);
		});
	},

	setDefaultPosition: function() {
		this.animateBorder($(this.activeItem).position().left, $(this.activeItem).outerWidth);
	},

	animateBorder: function(left, width) {
		$(this.border).animate({
			left: left,
			width: width
		}, 250);
	},

	appendBorder: function() {
		$(this.menu).last().append('<li class="border"></li>');
		this.border = $(this.menu).find('li.border');
		this.border.width($(this.activeItem).outerWidth());
	},

	init: function() {
		this.__prepareVars();
	}
};

module.exports = cursorFollower;