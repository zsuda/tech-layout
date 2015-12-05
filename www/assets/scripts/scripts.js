(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
var app = app || {};
var helper = require('./helper');
var formValidation = require('./formValidation');
var tabs = require('./tabs');
var anchor = require('./anchor');
var cursorFollower = require('./cursorFollower');
var features = require('./features');

$(window).on('load', function() {
	window.helper = helper;
	tabs.init();
	anchor.init();
	cursorFollower.init();
	window.cursorFollower = cursorFollower;
	formValidation.init();
	features.init();
});
},{"./anchor":1,"./cursorFollower":3,"./features":4,"./formValidation":5,"./helper":6,"./tabs":7}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
var features = {
	st: null,
	seal: null,
	horse: null,
	prosConsItem: null,
	prosConsParagraph: null,
	prosConsRow: null,

	__prepareVars: function() {
		this.st = helper.scrollTop();
		this.seal = '.seal .animal img';
		this.horse = '.horse .animal img';

		this.prosConsRow = '.problems .row';
		this.prosConsItem = '.problems .item';
		this.prosConsParagraph = '.problems .item p';

		this.__listeners();
		this.compareParegraphHeight();

		if((($(this.seal).offset().top + $(window).height()/3) < (this.st + $(window).height()))) {
			this.animateElement(this.seal);
		}
		if((($(this.horse).offset().top + $(window).height()/3) < (this.st + $(window).height()))) {
			this.animateElement(this.horse);
		}
	},

	__listeners: function() {
		var _self = this;

		$(window).on('scroll', function() {
			this.st = helper.scrollTop();
			if((($(_self.seal).offset().top + $(window).height()/3) < (this.st + $(window).height()))) {
				_self.animateElement(_self.seal);
			}
			if((($(_self.horse).offset().top + $(window).height()/3) < (this.st + $(window).height()))) {
				_self.animateElement(_self.horse);
			}
		});
	},

	animateElement: function(el) {
		$(el).animate({
			opacity: 1
		}, 500);
	},

	compareParegraphHeight: function() {
		if($(this.prosConsRow).length) {
			$(this.prosConsRow).each(function(){
				var row = this;
				var highestBox = 0;
				$(row).find('article').each(function(){
					$(this).find('p').each(function() {
						if($(this).height() > highestBox)
							highestBox = $(this).height();
					});
				});
				$(row).find('article p').height(highestBox);
			});
		}
	},

	init: function() {
		this.__prepareVars();
	}
};

module.exports = features;
},{}],5:[function(require,module,exports){
formValidation = {
	init: function() {
		function hasHtml5Validation () {
			return typeof document.createElement('input').checkValidity === 'function';
		}

		if (hasHtml5Validation()) {
			$('form').submit(function (e) {
				if (!this.checkValidity()) {
					e.preventDefault();
					$(this).addClass('invalid');
				} else {
					$(this).removeClass('invalid');
				}

				$(this).find('.errorMessage').remove();
				$(this).prepend('<div class="errorMessage">zkontrolujte správnost zadaných údajů u vyznačených polí</div>');
			});
		}
	}
}

module.exports = formValidation;
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
tabs = {
	tabsWrap: null,
	bookmark: null,
	content: null,
	activeClass: 'active',
	currentTab: null,
	currentWrap: null,

	elements: {
		elTabsWrap: '.tabs',
		elBookmarks: '.tabBookmarks .item',
		elContent: '.tabContent'
	},

	__prepareVars: function() {
		if($(this.elements.elTabsWrap).length) {
			this.tabsWrap = this.elements.elTabsWrap;
		}

		if($(this.elements.elBookmarks).length) {
			this.bookmark = this.elements.elBookmarks;
		}

		if($(this.elements.elContent).length) {
			this.content = this.elements.elContent;
		}

		this.setDefaultActive();
		this.__listeners();
	},

	__listeners: function() {
		var _self = this;

		$(document).on('click', this.bookmark, function() {
			_self.currentTab = $(this);
			_self.currentWrap = $(this).parents(_self.tabsWrap);
			_self.switchTabs();
		});
	},

	setDefaultActive: function() {
		var _self = this;

		$(this.tabsWrap).each(function() {

			$(this).find(_self.bookmark).first().addClass(_self.activeClass);
			$(this).find(_self.content).first().addClass(_self.activeClass);
		});
	},

	switchTabs: function() {
		if(!this.currentTab.hasClass(this.activeClass)) {
			$(this.currentWrap).find(this.bookmark + ', ' + this.content).removeClass(this.activeClass);
			$(this.currentTab).addClass(this.activeClass);
			$(this.content + '[data-tab-content="' + this.currentTab.data('tabBookmark') + '"]').addClass(this.activeClass);
		}
	},

	init: function() {
		this.__prepareVars();
	}
};

module.exports = tabs;
},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvYXNzZXRzL3NjcmlwdHMvYXBwL2FuY2hvci5qcyIsInd3dy9hc3NldHMvc2NyaXB0cy9hcHAvYXBwLmpzIiwid3d3L2Fzc2V0cy9zY3JpcHRzL2FwcC9jdXJzb3JGb2xsb3dlci5qcyIsInd3dy9hc3NldHMvc2NyaXB0cy9hcHAvZmVhdHVyZXMuanMiLCJ3d3cvYXNzZXRzL3NjcmlwdHMvYXBwL2Zvcm1WYWxpZGF0aW9uLmpzIiwid3d3L2Fzc2V0cy9zY3JpcHRzL2FwcC9oZWxwZXIuanMiLCJ3d3cvYXNzZXRzL3NjcmlwdHMvYXBwL3RhYnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImFuY2hvciA9IHtcblx0aXNBbmltYXRlZDogZmFsc2UsXG5cdGNsYXNzQWN0aXZlOiAnYWN0aXZlJyxcblx0Y2xlYXJIYXNoOiBudWxsLFxuXHRoYXNoOiB3aW5kb3cubG9jYXRpb24uaGFzaCxcblx0dGVtcEhhc2g6IG51bGwsXG5cdHNjcm9sbFRvcDogMCxcblx0bWVudUl0ZW06IG51bGwsXG5cdGhlYWRlckhlaWdodDogMCxcblxuXHRzZWN0aW9uOiBudWxsLFxuXG5cdF9fcHJlcGFyZVZhcnM6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc2Nyb2xsVG9wID0gaGVscGVyLnNjcm9sbFRvcCgpO1xuXHRcdHRoaXMubWVudUl0ZW0gPSAnLm1lbnUgYSc7XG5cdFx0dGhpcy5oZWFkZXIgPSAnLmhlYWRlcic7XG5cblx0XHR0aGlzLmhlYWRlckhlaWdodCA9ICQodGhpcy5oZWFkZXIpLm91dGVySGVpZ2h0KCk7XG5cblx0XHR0aGlzLl9fYWRkTGlzdGVuZXJzKCk7XG5cdH0sXG5cblx0X19hZGRMaXN0ZW5lcnM6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBfc2VsZiA9IHRoaXM7XG5cblx0XHQkKGRvY3VtZW50KS5vbignY2xpY2snLCBfc2VsZi5tZW51SXRlbSwgZnVuY3Rpb24oZSkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRfc2VsZi5oYXNoID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XG5cdFx0XHRfc2VsZi5fX3NldENsZWFySGFzaCgpO1xuXHRcdFx0X3NlbGYuX19zZXRUZW1wSGFzaCgpO1xuXHRcdFx0X3NlbGYuX19zZXRBY3RpdmVNZW51SXRlbSgpO1xuXHRcdFx0X3NlbGYuaXNBbmltYXRlZCA9IHRydWU7XG5cdFx0XHRfc2VsZi5zY3JvbGxUb1NlY3Rpb24oKTtcblx0XHR9KTtcblxuXHRcdCQod2luZG93KS5vbignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRfc2VsZi5zY3JvbGxUb3AgPSBoZWxwZXIuc2Nyb2xsVG9wKCk7XG5cdFx0XHRfc2VsZi5fX2dldFZpc2libGVTZWN0aW9uKCk7XG5cdFx0fSk7XG5cblx0XHQkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0X3NlbGYuaGVhZGVySGVpZ2h0ID0gJChfc2VsZi5oZWFkZXIpLm91dGVySGVpZ2h0KCk7XG5cdFx0fSk7XG5cdH0sXG5cblx0X19zZXRDbGVhckhhc2g6IGZ1bmN0aW9uKCkge1xuXHRcdGlmKHRoaXMuaGFzaC5pbmRleE9mKCcjXycpID4gLTEpIHtcblx0XHRcdHRoaXMuY2xlYXJIYXNoID0gdGhpcy5oYXNoLnJlcGxhY2UoJyNfJywgJycpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMuY2xlYXJIYXNoID0gdGhpcy5oYXNoLnJlcGxhY2UoJyMnLCAnJyk7XG5cdFx0fVxuXHR9LFxuXG5cdF9fc2V0QWN0aXZlTWVudUl0ZW06IGZ1bmN0aW9uKHNldEFjdGl2ZSkge1xuXHRcdGlmKHNldEFjdGl2ZSkge1xuXHRcdFx0JCh0aGlzLm1lbnVJdGVtKS5maXJzdCgpLmFkZENsYXNzKHRoaXMuY2xhc3NBY3RpdmUpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdCQodGhpcy5tZW51SXRlbSkucmVtb3ZlQ2xhc3ModGhpcy5jbGFzc0FjdGl2ZSk7XG5cdFx0XHQkKHRoaXMubWVudUl0ZW0gKyAnW2hyZWYqPScgKyB0aGlzLmNsZWFySGFzaCArICddJykuYWRkQ2xhc3ModGhpcy5jbGFzc0FjdGl2ZSk7XG5cdFx0fVxuXHR9LFxuXG5cdF9fc2V0VGVtcEhhc2g6IGZ1bmN0aW9uKCkge1xuXHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJyNfJyArIHRoaXMuY2xlYXJIYXNoO1xuXHR9LFxuXG5cdHNjcm9sbFRvU2VjdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIF9zZWxmID0gdGhpcztcblx0XHR2YXIgb2Zmc2V0ID0gJCgnIycgKyB0aGlzLmNsZWFySGFzaCkub2Zmc2V0KCkudG9wIC0gX3NlbGYuaGVhZGVySGVpZ2h0O1xuXG5cdFx0JCgnaHRtbCxib2R5JykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiBvZmZzZXR9LCAnc2xvdycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRfc2VsZi5pc0FuaW1hdGVkID0gZmFsc2U7XG5cdFx0fSk7XG5cdH0sXG5cblx0X19nZXRWaXNpYmxlU2VjdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIF9zZWxmID0gdGhpcztcblx0XHR2YXIgY2xvc2VzdCA9IDA7XG5cdFx0dmFyIG5leHQgPSAwO1xuXHRcdHZhciB2aXNpYmxlU2VjdGlvbiA9ICdxdWVzdGlvbic7XG5cdFx0dmFyIG5leHRTZWN0aW9uID0gbnVsbDtcblxuXHRcdGlmKF9zZWxmLmlzQW5pbWF0ZWQgPT09IGZhbHNlKVxuXHRcdHtcblx0XHRcdCQoJ3NlY3Rpb24nKS5lYWNoKGZ1bmN0aW9uKGluZGV4KVxuXHRcdFx0e1xuXHRcdFx0XHRpZihoZWxwZXIuc2Nyb2xsVG9wKCkgPiAkKHRoaXMpLm9mZnNldCgpLnRvcCAtIF9zZWxmLmhlYWRlckhlaWdodCAtIDUpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjbG9zZXN0ID0gaW5kZXg7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZihoZWxwZXIuc2Nyb2xsVG9wKCkgPiAkKHRoaXMpLm9mZnNldCgpLnRvcClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG5leHQgPSBpbmRleCArIDE7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHR2aXNpYmxlU2VjdGlvbiA9ICQoJ3NlY3Rpb24nKS5lcShjbG9zZXN0KS5hdHRyKCdpZCcpO1xuXHRcdFx0bmV4dFNlY3Rpb24gPSAkKCdzZWN0aW9uJykuZXEobmV4dCkuYXR0cignaWQnKTtcblxuXHRcdFx0aWYoX3NlbGYuc2VjdGlvbiAhPT0gdmlzaWJsZVNlY3Rpb24pXG5cdFx0XHR7XG5cdFx0XHRcdF9zZWxmLnNlY3Rpb24gPSB2aXNpYmxlU2VjdGlvbjtcblx0XHRcdFx0X3NlbGYuY2xlYXJIYXNoID0gdmlzaWJsZVNlY3Rpb247XG5cdFx0XHRcdF9zZWxmLl9fc2V0QWN0aXZlTWVudUl0ZW0oKTtcblx0XHRcdFx0X3NlbGYuX19zZXRUZW1wSGFzaCgpO1xuXHRcdFx0XHR2YXIgcG9zaXRpb25MZWZ0ID0gJCh3aW5kb3cuY3Vyc29yRm9sbG93ZXIuYWN0aXZlSXRlbSkucGFyZW50cygnbGknKS5wb3NpdGlvbigpLmxlZnQ7XG5cdFx0XHRcdHZhciB3aWR0aCA9ICQod2luZG93LmN1cnNvckZvbGxvd2VyLmFjdGl2ZUl0ZW0pLm91dGVyV2lkdGgoKTtcblx0XHRcdFx0JCh3aW5kb3cuY3Vyc29yRm9sbG93ZXIuYW5pbWF0ZUJvcmRlcihwb3NpdGlvbkxlZnQsIHdpZHRoKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX19wcmVwYXJlVmFycygpO1xuXG5cdFx0aWYod2luZG93LmxvY2F0aW9uLmhhc2ggPT0gJycpIHtcblx0XHRcdHRoaXMuX19zZXRBY3RpdmVNZW51SXRlbSh0cnVlKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aGlzLl9fc2V0Q2xlYXJIYXNoKCk7XG5cdFx0XHR0aGlzLl9fc2V0VGVtcEhhc2goKTtcblx0XHRcdHRoaXMuX19zZXRBY3RpdmVNZW51SXRlbSgpO1xuXHRcdFx0dGhpcy5zY3JvbGxUb1NlY3Rpb24oKTtcblx0XHR9XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYW5jaG9yOyIsInZhciBhcHAgPSBhcHAgfHwge307XG52YXIgaGVscGVyID0gcmVxdWlyZSgnLi9oZWxwZXInKTtcbnZhciBmb3JtVmFsaWRhdGlvbiA9IHJlcXVpcmUoJy4vZm9ybVZhbGlkYXRpb24nKTtcbnZhciB0YWJzID0gcmVxdWlyZSgnLi90YWJzJyk7XG52YXIgYW5jaG9yID0gcmVxdWlyZSgnLi9hbmNob3InKTtcbnZhciBjdXJzb3JGb2xsb3dlciA9IHJlcXVpcmUoJy4vY3Vyc29yRm9sbG93ZXInKTtcbnZhciBmZWF0dXJlcyA9IHJlcXVpcmUoJy4vZmVhdHVyZXMnKTtcblxuJCh3aW5kb3cpLm9uKCdsb2FkJywgZnVuY3Rpb24oKSB7XG5cdHdpbmRvdy5oZWxwZXIgPSBoZWxwZXI7XG5cdHRhYnMuaW5pdCgpO1xuXHRhbmNob3IuaW5pdCgpO1xuXHRjdXJzb3JGb2xsb3dlci5pbml0KCk7XG5cdHdpbmRvdy5jdXJzb3JGb2xsb3dlciA9IGN1cnNvckZvbGxvd2VyO1xuXHRmb3JtVmFsaWRhdGlvbi5pbml0KCk7XG5cdGZlYXR1cmVzLmluaXQoKTtcbn0pOyIsImN1cnNvckZvbGxvd2VyID0ge1xuXHRtZW51OiBudWxsLFxuXHRpdGVtOiBudWxsLFxuXHRhY3RpdmVJdGVtOiBudWxsLFxuXHRib3JkZXI6IG51bGwsXG5cdGxlZnQ6IDAsXG5cdHdpZHRoOiAwLFxuXHRsYXN0TGVmdDogMCxcblx0bGFzdFdpZHRoOiAwLFxuXG5cdF9fcHJlcGFyZVZhcnM6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMubWVudSA9ICcuaGVhZGVyIG5hdiB1bCc7XG5cdFx0dGhpcy5pdGVtID0gdGhpcy5tZW51ICsgJyBhJztcblx0XHR0aGlzLmFjdGl2ZUl0ZW0gPSB0aGlzLm1lbnUgKyAnIGEuYWN0aXZlJztcblxuXHRcdHRoaXMuYXBwZW5kQm9yZGVyKCk7XG5cdFx0dGhpcy5zZXREZWZhdWx0UG9zaXRpb24oKTtcblx0XHR0aGlzLl9fbGlzdGVuZXJzKCk7XG5cdH0sXG5cblx0X19saXN0ZW5lcnM6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBfc2VsZiA9IHRoaXM7XG5cblx0XHQkKGRvY3VtZW50KS5vbignbW91c2VlbnRlcicsIHRoaXMuaXRlbSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRfc2VsZi5sYXN0TGVmdCA9ICQoX3NlbGYuYWN0aXZlSXRlbSkucGFyZW50cygnbGknKS5wb3NpdGlvbigpLmxlZnQ7XG5cdFx0XHRfc2VsZi5sYXN0V2lkdGggPSAkKF9zZWxmLmFjdGl2ZUl0ZW0pLnBhcmVudHMoJ2xpJykub3V0ZXJXaWR0aCgpO1xuXHRcdFx0X3NlbGYubGVmdCA9ICQodGhpcykucGFyZW50cygnbGknKS5wb3NpdGlvbigpLmxlZnQ7XG5cdFx0XHRfc2VsZi53aWR0aCA9ICQodGhpcykucGFyZW50cygnbGknKS5vdXRlcldpZHRoKCk7XG5cblx0XHRcdF9zZWxmLmFuaW1hdGVCb3JkZXIoX3NlbGYubGVmdCwgX3NlbGYud2lkdGgpO1xuXHRcdH0pO1xuXG5cdFx0JChkb2N1bWVudCkub24oJ21vdXNlbGVhdmUnLCB0aGlzLm1lbnUsIGZ1bmN0aW9uKCkge1xuXHRcdFx0X3NlbGYuYW5pbWF0ZUJvcmRlcihfc2VsZi5sYXN0TGVmdCwgX3NlbGYubGFzdFdpZHRoKTtcblx0XHR9KTtcblxuXHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuaXRlbSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRfc2VsZi5sYXN0TGVmdCA9IF9zZWxmLmxlZnQgPSAkKHRoaXMpLnBhcmVudHMoJ2xpJykucG9zaXRpb24oKS5sZWZ0O1xuXHRcdFx0X3NlbGYubGFzdFdpZHRoID0gX3NlbGYud2lkdGggPSAkKHRoaXMpLnBhcmVudHMoJ2xpJykub3V0ZXJXaWR0aCgpO1xuXHRcdFx0X3NlbGYuYW5pbWF0ZUJvcmRlcihfc2VsZi5sZWZ0LCBfc2VsZi53aWR0aCk7XG5cdFx0fSk7XG5cblx0XHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmxvZ28gYScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0X3NlbGYubGFzdExlZnQgPSBfc2VsZi5sZWZ0ID0gJChfc2VsZi5hY3RpdmVJdGVtKS5wYXJlbnRzKCdsaScpLnBvc2l0aW9uKCkubGVmdDtcblx0XHRcdF9zZWxmLmxhc3RXaWR0aCA9IF9zZWxmLndpZHRoID0gJChfc2VsZi5hY3RpdmVJdGVtKS5wYXJlbnRzKCdsaScpLm91dGVyV2lkdGgoKTtcblxuXG5cblx0XHRcdF9zZWxmLmFuaW1hdGVCb3JkZXIoX3NlbGYubGVmdCwgX3NlbGYud2lkdGgpO1xuXHRcdH0pO1xuXHR9LFxuXG5cdHNldERlZmF1bHRQb3NpdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5hbmltYXRlQm9yZGVyKCQodGhpcy5hY3RpdmVJdGVtKS5wb3NpdGlvbigpLmxlZnQsICQodGhpcy5hY3RpdmVJdGVtKS5vdXRlcldpZHRoKTtcblx0fSxcblxuXHRhbmltYXRlQm9yZGVyOiBmdW5jdGlvbihsZWZ0LCB3aWR0aCkge1xuXHRcdCQodGhpcy5ib3JkZXIpLmFuaW1hdGUoe1xuXHRcdFx0bGVmdDogbGVmdCxcblx0XHRcdHdpZHRoOiB3aWR0aFxuXHRcdH0sIDI1MCk7XG5cdH0sXG5cblx0YXBwZW5kQm9yZGVyOiBmdW5jdGlvbigpIHtcblx0XHQkKHRoaXMubWVudSkubGFzdCgpLmFwcGVuZCgnPGxpIGNsYXNzPVwiYm9yZGVyXCI+PC9saT4nKTtcblx0XHR0aGlzLmJvcmRlciA9ICQodGhpcy5tZW51KS5maW5kKCdsaS5ib3JkZXInKTtcblx0XHR0aGlzLmJvcmRlci53aWR0aCgkKHRoaXMuYWN0aXZlSXRlbSkub3V0ZXJXaWR0aCgpKTtcblx0fSxcblxuXHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLl9fcHJlcGFyZVZhcnMoKTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjdXJzb3JGb2xsb3dlcjsiLCJ2YXIgZmVhdHVyZXMgPSB7XG5cdHN0OiBudWxsLFxuXHRzZWFsOiBudWxsLFxuXHRob3JzZTogbnVsbCxcblx0cHJvc0NvbnNJdGVtOiBudWxsLFxuXHRwcm9zQ29uc1BhcmFncmFwaDogbnVsbCxcblx0cHJvc0NvbnNSb3c6IG51bGwsXG5cblx0X19wcmVwYXJlVmFyczogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5zdCA9IGhlbHBlci5zY3JvbGxUb3AoKTtcblx0XHR0aGlzLnNlYWwgPSAnLnNlYWwgLmFuaW1hbCBpbWcnO1xuXHRcdHRoaXMuaG9yc2UgPSAnLmhvcnNlIC5hbmltYWwgaW1nJztcblxuXHRcdHRoaXMucHJvc0NvbnNSb3cgPSAnLnByb2JsZW1zIC5yb3cnO1xuXHRcdHRoaXMucHJvc0NvbnNJdGVtID0gJy5wcm9ibGVtcyAuaXRlbSc7XG5cdFx0dGhpcy5wcm9zQ29uc1BhcmFncmFwaCA9ICcucHJvYmxlbXMgLml0ZW0gcCc7XG5cblx0XHR0aGlzLl9fbGlzdGVuZXJzKCk7XG5cdFx0dGhpcy5jb21wYXJlUGFyZWdyYXBoSGVpZ2h0KCk7XG5cblx0XHRpZigoKCQodGhpcy5zZWFsKS5vZmZzZXQoKS50b3AgKyAkKHdpbmRvdykuaGVpZ2h0KCkvMykgPCAodGhpcy5zdCArICQod2luZG93KS5oZWlnaHQoKSkpKSB7XG5cdFx0XHR0aGlzLmFuaW1hdGVFbGVtZW50KHRoaXMuc2VhbCk7XG5cdFx0fVxuXHRcdGlmKCgoJCh0aGlzLmhvcnNlKS5vZmZzZXQoKS50b3AgKyAkKHdpbmRvdykuaGVpZ2h0KCkvMykgPCAodGhpcy5zdCArICQod2luZG93KS5oZWlnaHQoKSkpKSB7XG5cdFx0XHR0aGlzLmFuaW1hdGVFbGVtZW50KHRoaXMuaG9yc2UpO1xuXHRcdH1cblx0fSxcblxuXHRfX2xpc3RlbmVyczogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIF9zZWxmID0gdGhpcztcblxuXHRcdCQod2luZG93KS5vbignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLnN0ID0gaGVscGVyLnNjcm9sbFRvcCgpO1xuXHRcdFx0aWYoKCgkKF9zZWxmLnNlYWwpLm9mZnNldCgpLnRvcCArICQod2luZG93KS5oZWlnaHQoKS8zKSA8ICh0aGlzLnN0ICsgJCh3aW5kb3cpLmhlaWdodCgpKSkpIHtcblx0XHRcdFx0X3NlbGYuYW5pbWF0ZUVsZW1lbnQoX3NlbGYuc2VhbCk7XG5cdFx0XHR9XG5cdFx0XHRpZigoKCQoX3NlbGYuaG9yc2UpLm9mZnNldCgpLnRvcCArICQod2luZG93KS5oZWlnaHQoKS8zKSA8ICh0aGlzLnN0ICsgJCh3aW5kb3cpLmhlaWdodCgpKSkpIHtcblx0XHRcdFx0X3NlbGYuYW5pbWF0ZUVsZW1lbnQoX3NlbGYuaG9yc2UpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXG5cdGFuaW1hdGVFbGVtZW50OiBmdW5jdGlvbihlbCkge1xuXHRcdCQoZWwpLmFuaW1hdGUoe1xuXHRcdFx0b3BhY2l0eTogMVxuXHRcdH0sIDUwMCk7XG5cdH0sXG5cblx0Y29tcGFyZVBhcmVncmFwaEhlaWdodDogZnVuY3Rpb24oKSB7XG5cdFx0aWYoJCh0aGlzLnByb3NDb25zUm93KS5sZW5ndGgpIHtcblx0XHRcdCQodGhpcy5wcm9zQ29uc1JvdykuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgcm93ID0gdGhpcztcblx0XHRcdFx0dmFyIGhpZ2hlc3RCb3ggPSAwO1xuXHRcdFx0XHQkKHJvdykuZmluZCgnYXJ0aWNsZScpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0XHQkKHRoaXMpLmZpbmQoJ3AnKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0aWYoJCh0aGlzKS5oZWlnaHQoKSA+IGhpZ2hlc3RCb3gpXG5cdFx0XHRcdFx0XHRcdGhpZ2hlc3RCb3ggPSAkKHRoaXMpLmhlaWdodCgpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JChyb3cpLmZpbmQoJ2FydGljbGUgcCcpLmhlaWdodChoaWdoZXN0Qm94KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblxuXHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLl9fcHJlcGFyZVZhcnMoKTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmZWF0dXJlczsiLCJmb3JtVmFsaWRhdGlvbiA9IHtcblx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0ZnVuY3Rpb24gaGFzSHRtbDVWYWxpZGF0aW9uICgpIHtcblx0XHRcdHJldHVybiB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKS5jaGVja1ZhbGlkaXR5ID09PSAnZnVuY3Rpb24nO1xuXHRcdH1cblxuXHRcdGlmIChoYXNIdG1sNVZhbGlkYXRpb24oKSkge1xuXHRcdFx0JCgnZm9ybScpLnN1Ym1pdChmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRpZiAoIXRoaXMuY2hlY2tWYWxpZGl0eSgpKSB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ2ludmFsaWQnKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKCdpbnZhbGlkJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkKHRoaXMpLmZpbmQoJy5lcnJvck1lc3NhZ2UnKS5yZW1vdmUoKTtcblx0XHRcdFx0JCh0aGlzKS5wcmVwZW5kKCc8ZGl2IGNsYXNzPVwiZXJyb3JNZXNzYWdlXCI+emtvbnRyb2x1anRlIHNwcsOhdm5vc3QgemFkYW7DvWNoIMO6ZGFqxa8gdSB2eXpuYcSNZW7DvWNoIHBvbMOtPC9kaXY+Jyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmb3JtVmFsaWRhdGlvbjsiLCJ2YXIgaGVscGVyID0ge1xuXHR3aW5kb3dXaWR0aDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICQod2luZG93KS53aWR0aCgpO1xuXHR9LFxuXG5cdHNjcm9sbFRvcDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICQod2luZG93KS5zY3JvbGxUb3AoKTtcblx0fSxcblxuXHR3aW5kb3dIZWlnaHQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAkKHdpbmRvdykuaGVpZ2h0KCk7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaGVscGVyOyIsInRhYnMgPSB7XG5cdHRhYnNXcmFwOiBudWxsLFxuXHRib29rbWFyazogbnVsbCxcblx0Y29udGVudDogbnVsbCxcblx0YWN0aXZlQ2xhc3M6ICdhY3RpdmUnLFxuXHRjdXJyZW50VGFiOiBudWxsLFxuXHRjdXJyZW50V3JhcDogbnVsbCxcblxuXHRlbGVtZW50czoge1xuXHRcdGVsVGFic1dyYXA6ICcudGFicycsXG5cdFx0ZWxCb29rbWFya3M6ICcudGFiQm9va21hcmtzIC5pdGVtJyxcblx0XHRlbENvbnRlbnQ6ICcudGFiQ29udGVudCdcblx0fSxcblxuXHRfX3ByZXBhcmVWYXJzOiBmdW5jdGlvbigpIHtcblx0XHRpZigkKHRoaXMuZWxlbWVudHMuZWxUYWJzV3JhcCkubGVuZ3RoKSB7XG5cdFx0XHR0aGlzLnRhYnNXcmFwID0gdGhpcy5lbGVtZW50cy5lbFRhYnNXcmFwO1xuXHRcdH1cblxuXHRcdGlmKCQodGhpcy5lbGVtZW50cy5lbEJvb2ttYXJrcykubGVuZ3RoKSB7XG5cdFx0XHR0aGlzLmJvb2ttYXJrID0gdGhpcy5lbGVtZW50cy5lbEJvb2ttYXJrcztcblx0XHR9XG5cblx0XHRpZigkKHRoaXMuZWxlbWVudHMuZWxDb250ZW50KS5sZW5ndGgpIHtcblx0XHRcdHRoaXMuY29udGVudCA9IHRoaXMuZWxlbWVudHMuZWxDb250ZW50O1xuXHRcdH1cblxuXHRcdHRoaXMuc2V0RGVmYXVsdEFjdGl2ZSgpO1xuXHRcdHRoaXMuX19saXN0ZW5lcnMoKTtcblx0fSxcblxuXHRfX2xpc3RlbmVyczogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIF9zZWxmID0gdGhpcztcblxuXHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuYm9va21hcmssIGZ1bmN0aW9uKCkge1xuXHRcdFx0X3NlbGYuY3VycmVudFRhYiA9ICQodGhpcyk7XG5cdFx0XHRfc2VsZi5jdXJyZW50V3JhcCA9ICQodGhpcykucGFyZW50cyhfc2VsZi50YWJzV3JhcCk7XG5cdFx0XHRfc2VsZi5zd2l0Y2hUYWJzKCk7XG5cdFx0fSk7XG5cdH0sXG5cblx0c2V0RGVmYXVsdEFjdGl2ZTogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIF9zZWxmID0gdGhpcztcblxuXHRcdCQodGhpcy50YWJzV3JhcCkuZWFjaChmdW5jdGlvbigpIHtcblxuXHRcdFx0JCh0aGlzKS5maW5kKF9zZWxmLmJvb2ttYXJrKS5maXJzdCgpLmFkZENsYXNzKF9zZWxmLmFjdGl2ZUNsYXNzKTtcblx0XHRcdCQodGhpcykuZmluZChfc2VsZi5jb250ZW50KS5maXJzdCgpLmFkZENsYXNzKF9zZWxmLmFjdGl2ZUNsYXNzKTtcblx0XHR9KTtcblx0fSxcblxuXHRzd2l0Y2hUYWJzOiBmdW5jdGlvbigpIHtcblx0XHRpZighdGhpcy5jdXJyZW50VGFiLmhhc0NsYXNzKHRoaXMuYWN0aXZlQ2xhc3MpKSB7XG5cdFx0XHQkKHRoaXMuY3VycmVudFdyYXApLmZpbmQodGhpcy5ib29rbWFyayArICcsICcgKyB0aGlzLmNvbnRlbnQpLnJlbW92ZUNsYXNzKHRoaXMuYWN0aXZlQ2xhc3MpO1xuXHRcdFx0JCh0aGlzLmN1cnJlbnRUYWIpLmFkZENsYXNzKHRoaXMuYWN0aXZlQ2xhc3MpO1xuXHRcdFx0JCh0aGlzLmNvbnRlbnQgKyAnW2RhdGEtdGFiLWNvbnRlbnQ9XCInICsgdGhpcy5jdXJyZW50VGFiLmRhdGEoJ3RhYkJvb2ttYXJrJykgKyAnXCJdJykuYWRkQ2xhc3ModGhpcy5hY3RpdmVDbGFzcyk7XG5cdFx0fVxuXHR9LFxuXG5cdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX19wcmVwYXJlVmFycygpO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRhYnM7Il19
