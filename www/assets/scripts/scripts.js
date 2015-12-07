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
var carousel = require('./carousel');

$(window).on('load', function() {
	window.helper = helper;
	tabs.init();
	anchor.init();
	cursorFollower.init();
	window.cursorFollower = cursorFollower;
	formValidation.init();
	features.init();

	$('.mainCarousel .carousel').carousel({transition: 'slide'});
	//$('.bottomCarousel .carousel').carousel({transition: 'fade'});
});
},{"./anchor":1,"./carousel":3,"./cursorFollower":4,"./features":5,"./formValidation":6,"./helper":7,"./tabs":8}],3:[function(require,module,exports){
carousel = (function($) {
	$.fn.carousel = function(options) {
		_self = this;

		this.options = $.extend({}, this.defaultOptions, options);

		this.defaultOptions = {
			speed: 250,
			transition: 'slide'
		};

		this.elements = {
			wrapper: null,
			holder: null,
			item: null
		};

		this.each(function() {
			var $t = $(this);

			$t.wrapInner('<div class="carousel-wrapper"><div class="carousel-holder"></div></div>');

			_self.elements.wrapper = $t.find('.carousel-wrapper');
			_self.elements.holder = $t.find('.carousel-holder');
			_self.elements.item = $t.find('.item');

			_self.elements.wrapper.css({
				'overflow-x': 'hidden',
				'position': 'relative'
			});

			if(_self.options.transition == 'slide') {
				_self.elements.holder.css({
					'width': _self.elements.item.length * _self.elements.item.outerWidth()
				});

				_self.elements.item.css({
					'width': _self.elements.holder.outerWidth() / _self.elements.item.length,
					'float': 'left'
				});
			}
		});

		//console.log(this.options.transition);
	};
})(jQuery);

module.exports = carousel;
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
};

module.exports = formValidation;
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvYXNzZXRzL3NjcmlwdHMvYXBwL2FuY2hvci5qcyIsInd3dy9hc3NldHMvc2NyaXB0cy9hcHAvYXBwLmpzIiwid3d3L2Fzc2V0cy9zY3JpcHRzL2FwcC9jYXJvdXNlbC5qcyIsInd3dy9hc3NldHMvc2NyaXB0cy9hcHAvY3Vyc29yRm9sbG93ZXIuanMiLCJ3d3cvYXNzZXRzL3NjcmlwdHMvYXBwL2ZlYXR1cmVzLmpzIiwid3d3L2Fzc2V0cy9zY3JpcHRzL2FwcC9mb3JtVmFsaWRhdGlvbi5qcyIsInd3dy9hc3NldHMvc2NyaXB0cy9hcHAvaGVscGVyLmpzIiwid3d3L2Fzc2V0cy9zY3JpcHRzL2FwcC90YWJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiYW5jaG9yID0ge1xuXHRpc0FuaW1hdGVkOiBmYWxzZSxcblx0Y2xhc3NBY3RpdmU6ICdhY3RpdmUnLFxuXHRjbGVhckhhc2g6IG51bGwsXG5cdGhhc2g6IHdpbmRvdy5sb2NhdGlvbi5oYXNoLFxuXHR0ZW1wSGFzaDogbnVsbCxcblx0c2Nyb2xsVG9wOiAwLFxuXHRtZW51SXRlbTogbnVsbCxcblx0aGVhZGVySGVpZ2h0OiAwLFxuXG5cdHNlY3Rpb246IG51bGwsXG5cblx0X19wcmVwYXJlVmFyczogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5zY3JvbGxUb3AgPSBoZWxwZXIuc2Nyb2xsVG9wKCk7XG5cdFx0dGhpcy5tZW51SXRlbSA9ICcubWVudSBhJztcblx0XHR0aGlzLmhlYWRlciA9ICcuaGVhZGVyJztcblxuXHRcdHRoaXMuaGVhZGVySGVpZ2h0ID0gJCh0aGlzLmhlYWRlcikub3V0ZXJIZWlnaHQoKTtcblxuXHRcdHRoaXMuX19hZGRMaXN0ZW5lcnMoKTtcblx0fSxcblxuXHRfX2FkZExpc3RlbmVyczogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIF9zZWxmID0gdGhpcztcblxuXHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsIF9zZWxmLm1lbnVJdGVtLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdF9zZWxmLmhhc2ggPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcblx0XHRcdF9zZWxmLl9fc2V0Q2xlYXJIYXNoKCk7XG5cdFx0XHRfc2VsZi5fX3NldFRlbXBIYXNoKCk7XG5cdFx0XHRfc2VsZi5fX3NldEFjdGl2ZU1lbnVJdGVtKCk7XG5cdFx0XHRfc2VsZi5pc0FuaW1hdGVkID0gdHJ1ZTtcblx0XHRcdF9zZWxmLnNjcm9sbFRvU2VjdGlvbigpO1xuXHRcdH0pO1xuXG5cdFx0JCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcblx0XHRcdF9zZWxmLnNjcm9sbFRvcCA9IGhlbHBlci5zY3JvbGxUb3AoKTtcblx0XHRcdF9zZWxmLl9fZ2V0VmlzaWJsZVNlY3Rpb24oKTtcblx0XHR9KTtcblxuXHRcdCQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRfc2VsZi5oZWFkZXJIZWlnaHQgPSAkKF9zZWxmLmhlYWRlcikub3V0ZXJIZWlnaHQoKTtcblx0XHR9KTtcblx0fSxcblxuXHRfX3NldENsZWFySGFzaDogZnVuY3Rpb24oKSB7XG5cdFx0aWYodGhpcy5oYXNoLmluZGV4T2YoJyNfJykgPiAtMSkge1xuXHRcdFx0dGhpcy5jbGVhckhhc2ggPSB0aGlzLmhhc2gucmVwbGFjZSgnI18nLCAnJyk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGhpcy5jbGVhckhhc2ggPSB0aGlzLmhhc2gucmVwbGFjZSgnIycsICcnKTtcblx0XHR9XG5cdH0sXG5cblx0X19zZXRBY3RpdmVNZW51SXRlbTogZnVuY3Rpb24oc2V0QWN0aXZlKSB7XG5cdFx0aWYoc2V0QWN0aXZlKSB7XG5cdFx0XHQkKHRoaXMubWVudUl0ZW0pLmZpcnN0KCkuYWRkQ2xhc3ModGhpcy5jbGFzc0FjdGl2ZSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0JCh0aGlzLm1lbnVJdGVtKS5yZW1vdmVDbGFzcyh0aGlzLmNsYXNzQWN0aXZlKTtcblx0XHRcdCQodGhpcy5tZW51SXRlbSArICdbaHJlZio9JyArIHRoaXMuY2xlYXJIYXNoICsgJ10nKS5hZGRDbGFzcyh0aGlzLmNsYXNzQWN0aXZlKTtcblx0XHR9XG5cdH0sXG5cblx0X19zZXRUZW1wSGFzaDogZnVuY3Rpb24oKSB7XG5cdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSAnI18nICsgdGhpcy5jbGVhckhhc2g7XG5cdH0sXG5cblx0c2Nyb2xsVG9TZWN0aW9uOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgX3NlbGYgPSB0aGlzO1xuXHRcdHZhciBvZmZzZXQgPSAkKCcjJyArIHRoaXMuY2xlYXJIYXNoKS5vZmZzZXQoKS50b3AgLSBfc2VsZi5oZWFkZXJIZWlnaHQ7XG5cblx0XHQkKCdodG1sLGJvZHknKS5hbmltYXRlKHtzY3JvbGxUb3A6IG9mZnNldH0sICdzbG93JywgZnVuY3Rpb24oKXtcblx0XHRcdF9zZWxmLmlzQW5pbWF0ZWQgPSBmYWxzZTtcblx0XHR9KTtcblx0fSxcblxuXHRfX2dldFZpc2libGVTZWN0aW9uOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgX3NlbGYgPSB0aGlzO1xuXHRcdHZhciBjbG9zZXN0ID0gMDtcblx0XHR2YXIgbmV4dCA9IDA7XG5cdFx0dmFyIHZpc2libGVTZWN0aW9uID0gJ3F1ZXN0aW9uJztcblx0XHR2YXIgbmV4dFNlY3Rpb24gPSBudWxsO1xuXG5cdFx0aWYoX3NlbGYuaXNBbmltYXRlZCA9PT0gZmFsc2UpXG5cdFx0e1xuXHRcdFx0JCgnc2VjdGlvbicpLmVhY2goZnVuY3Rpb24oaW5kZXgpXG5cdFx0XHR7XG5cdFx0XHRcdGlmKGhlbHBlci5zY3JvbGxUb3AoKSA+ICQodGhpcykub2Zmc2V0KCkudG9wIC0gX3NlbGYuaGVhZGVySGVpZ2h0IC0gNSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNsb3Nlc3QgPSBpbmRleDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmKGhlbHBlci5zY3JvbGxUb3AoKSA+ICQodGhpcykub2Zmc2V0KCkudG9wKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bmV4dCA9IGluZGV4ICsgMTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHZpc2libGVTZWN0aW9uID0gJCgnc2VjdGlvbicpLmVxKGNsb3Nlc3QpLmF0dHIoJ2lkJyk7XG5cdFx0XHRuZXh0U2VjdGlvbiA9ICQoJ3NlY3Rpb24nKS5lcShuZXh0KS5hdHRyKCdpZCcpO1xuXG5cdFx0XHRpZihfc2VsZi5zZWN0aW9uICE9PSB2aXNpYmxlU2VjdGlvbilcblx0XHRcdHtcblx0XHRcdFx0X3NlbGYuc2VjdGlvbiA9IHZpc2libGVTZWN0aW9uO1xuXHRcdFx0XHRfc2VsZi5jbGVhckhhc2ggPSB2aXNpYmxlU2VjdGlvbjtcblx0XHRcdFx0X3NlbGYuX19zZXRBY3RpdmVNZW51SXRlbSgpO1xuXHRcdFx0XHRfc2VsZi5fX3NldFRlbXBIYXNoKCk7XG5cdFx0XHRcdHZhciBwb3NpdGlvbkxlZnQgPSAkKHdpbmRvdy5jdXJzb3JGb2xsb3dlci5hY3RpdmVJdGVtKS5wYXJlbnRzKCdsaScpLnBvc2l0aW9uKCkubGVmdDtcblx0XHRcdFx0dmFyIHdpZHRoID0gJCh3aW5kb3cuY3Vyc29yRm9sbG93ZXIuYWN0aXZlSXRlbSkub3V0ZXJXaWR0aCgpO1xuXHRcdFx0XHQkKHdpbmRvdy5jdXJzb3JGb2xsb3dlci5hbmltYXRlQm9yZGVyKHBvc2l0aW9uTGVmdCwgd2lkdGgpKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fX3ByZXBhcmVWYXJzKCk7XG5cblx0XHRpZih3aW5kb3cubG9jYXRpb24uaGFzaCA9PSAnJykge1xuXHRcdFx0dGhpcy5fX3NldEFjdGl2ZU1lbnVJdGVtKHRydWUpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMuX19zZXRDbGVhckhhc2goKTtcblx0XHRcdHRoaXMuX19zZXRUZW1wSGFzaCgpO1xuXHRcdFx0dGhpcy5fX3NldEFjdGl2ZU1lbnVJdGVtKCk7XG5cdFx0XHR0aGlzLnNjcm9sbFRvU2VjdGlvbigpO1xuXHRcdH1cblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBhbmNob3I7IiwidmFyIGFwcCA9IGFwcCB8fCB7fTtcbnZhciBoZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlcicpO1xudmFyIGZvcm1WYWxpZGF0aW9uID0gcmVxdWlyZSgnLi9mb3JtVmFsaWRhdGlvbicpO1xudmFyIHRhYnMgPSByZXF1aXJlKCcuL3RhYnMnKTtcbnZhciBhbmNob3IgPSByZXF1aXJlKCcuL2FuY2hvcicpO1xudmFyIGN1cnNvckZvbGxvd2VyID0gcmVxdWlyZSgnLi9jdXJzb3JGb2xsb3dlcicpO1xudmFyIGZlYXR1cmVzID0gcmVxdWlyZSgnLi9mZWF0dXJlcycpO1xudmFyIGNhcm91c2VsID0gcmVxdWlyZSgnLi9jYXJvdXNlbCcpO1xuXG4kKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbigpIHtcblx0d2luZG93LmhlbHBlciA9IGhlbHBlcjtcblx0dGFicy5pbml0KCk7XG5cdGFuY2hvci5pbml0KCk7XG5cdGN1cnNvckZvbGxvd2VyLmluaXQoKTtcblx0d2luZG93LmN1cnNvckZvbGxvd2VyID0gY3Vyc29yRm9sbG93ZXI7XG5cdGZvcm1WYWxpZGF0aW9uLmluaXQoKTtcblx0ZmVhdHVyZXMuaW5pdCgpO1xuXG5cdCQoJy5tYWluQ2Fyb3VzZWwgLmNhcm91c2VsJykuY2Fyb3VzZWwoe3RyYW5zaXRpb246ICdzbGlkZSd9KTtcblx0Ly8kKCcuYm90dG9tQ2Fyb3VzZWwgLmNhcm91c2VsJykuY2Fyb3VzZWwoe3RyYW5zaXRpb246ICdmYWRlJ30pO1xufSk7IiwiY2Fyb3VzZWwgPSAoZnVuY3Rpb24oJCkge1xuXHQkLmZuLmNhcm91c2VsID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXHRcdF9zZWxmID0gdGhpcztcblxuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcblxuXHRcdHRoaXMuZGVmYXVsdE9wdGlvbnMgPSB7XG5cdFx0XHRzcGVlZDogMjUwLFxuXHRcdFx0dHJhbnNpdGlvbjogJ3NsaWRlJ1xuXHRcdH07XG5cblx0XHR0aGlzLmVsZW1lbnRzID0ge1xuXHRcdFx0d3JhcHBlcjogbnVsbCxcblx0XHRcdGhvbGRlcjogbnVsbCxcblx0XHRcdGl0ZW06IG51bGxcblx0XHR9O1xuXG5cdFx0dGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICR0ID0gJCh0aGlzKTtcblxuXHRcdFx0JHQud3JhcElubmVyKCc8ZGl2IGNsYXNzPVwiY2Fyb3VzZWwtd3JhcHBlclwiPjxkaXYgY2xhc3M9XCJjYXJvdXNlbC1ob2xkZXJcIj48L2Rpdj48L2Rpdj4nKTtcblxuXHRcdFx0X3NlbGYuZWxlbWVudHMud3JhcHBlciA9ICR0LmZpbmQoJy5jYXJvdXNlbC13cmFwcGVyJyk7XG5cdFx0XHRfc2VsZi5lbGVtZW50cy5ob2xkZXIgPSAkdC5maW5kKCcuY2Fyb3VzZWwtaG9sZGVyJyk7XG5cdFx0XHRfc2VsZi5lbGVtZW50cy5pdGVtID0gJHQuZmluZCgnLml0ZW0nKTtcblxuXHRcdFx0X3NlbGYuZWxlbWVudHMud3JhcHBlci5jc3Moe1xuXHRcdFx0XHQnb3ZlcmZsb3cteCc6ICdoaWRkZW4nLFxuXHRcdFx0XHQncG9zaXRpb24nOiAncmVsYXRpdmUnXG5cdFx0XHR9KTtcblxuXHRcdFx0aWYoX3NlbGYub3B0aW9ucy50cmFuc2l0aW9uID09ICdzbGlkZScpIHtcblx0XHRcdFx0X3NlbGYuZWxlbWVudHMuaG9sZGVyLmNzcyh7XG5cdFx0XHRcdFx0J3dpZHRoJzogX3NlbGYuZWxlbWVudHMuaXRlbS5sZW5ndGggKiBfc2VsZi5lbGVtZW50cy5pdGVtLm91dGVyV2lkdGgoKVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRfc2VsZi5lbGVtZW50cy5pdGVtLmNzcyh7XG5cdFx0XHRcdFx0J3dpZHRoJzogX3NlbGYuZWxlbWVudHMuaG9sZGVyLm91dGVyV2lkdGgoKSAvIF9zZWxmLmVsZW1lbnRzLml0ZW0ubGVuZ3RoLFxuXHRcdFx0XHRcdCdmbG9hdCc6ICdsZWZ0J1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdC8vY29uc29sZS5sb2codGhpcy5vcHRpb25zLnRyYW5zaXRpb24pO1xuXHR9O1xufSkoalF1ZXJ5KTtcblxubW9kdWxlLmV4cG9ydHMgPSBjYXJvdXNlbDsiLCJjdXJzb3JGb2xsb3dlciA9IHtcblx0bWVudTogbnVsbCxcblx0aXRlbTogbnVsbCxcblx0YWN0aXZlSXRlbTogbnVsbCxcblx0Ym9yZGVyOiBudWxsLFxuXHRsZWZ0OiAwLFxuXHR3aWR0aDogMCxcblx0bGFzdExlZnQ6IDAsXG5cdGxhc3RXaWR0aDogMCxcblxuXHRfX3ByZXBhcmVWYXJzOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLm1lbnUgPSAnLmhlYWRlciBuYXYgdWwnO1xuXHRcdHRoaXMuaXRlbSA9IHRoaXMubWVudSArICcgYSc7XG5cdFx0dGhpcy5hY3RpdmVJdGVtID0gdGhpcy5tZW51ICsgJyBhLmFjdGl2ZSc7XG5cblx0XHR0aGlzLmFwcGVuZEJvcmRlcigpO1xuXHRcdHRoaXMuc2V0RGVmYXVsdFBvc2l0aW9uKCk7XG5cdFx0dGhpcy5fX2xpc3RlbmVycygpO1xuXHR9LFxuXG5cdF9fbGlzdGVuZXJzOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgX3NlbGYgPSB0aGlzO1xuXG5cdFx0JChkb2N1bWVudCkub24oJ21vdXNlZW50ZXInLCB0aGlzLml0ZW0sIGZ1bmN0aW9uKCkge1xuXHRcdFx0X3NlbGYubGFzdExlZnQgPSAkKF9zZWxmLmFjdGl2ZUl0ZW0pLnBhcmVudHMoJ2xpJykucG9zaXRpb24oKS5sZWZ0O1xuXHRcdFx0X3NlbGYubGFzdFdpZHRoID0gJChfc2VsZi5hY3RpdmVJdGVtKS5wYXJlbnRzKCdsaScpLm91dGVyV2lkdGgoKTtcblx0XHRcdF9zZWxmLmxlZnQgPSAkKHRoaXMpLnBhcmVudHMoJ2xpJykucG9zaXRpb24oKS5sZWZ0O1xuXHRcdFx0X3NlbGYud2lkdGggPSAkKHRoaXMpLnBhcmVudHMoJ2xpJykub3V0ZXJXaWR0aCgpO1xuXG5cdFx0XHRfc2VsZi5hbmltYXRlQm9yZGVyKF9zZWxmLmxlZnQsIF9zZWxmLndpZHRoKTtcblx0XHR9KTtcblxuXHRcdCQoZG9jdW1lbnQpLm9uKCdtb3VzZWxlYXZlJywgdGhpcy5tZW51LCBmdW5jdGlvbigpIHtcblx0XHRcdF9zZWxmLmFuaW1hdGVCb3JkZXIoX3NlbGYubGFzdExlZnQsIF9zZWxmLmxhc3RXaWR0aCk7XG5cdFx0fSk7XG5cblx0XHQkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLml0ZW0sIGZ1bmN0aW9uKCkge1xuXHRcdFx0X3NlbGYubGFzdExlZnQgPSBfc2VsZi5sZWZ0ID0gJCh0aGlzKS5wYXJlbnRzKCdsaScpLnBvc2l0aW9uKCkubGVmdDtcblx0XHRcdF9zZWxmLmxhc3RXaWR0aCA9IF9zZWxmLndpZHRoID0gJCh0aGlzKS5wYXJlbnRzKCdsaScpLm91dGVyV2lkdGgoKTtcblx0XHRcdF9zZWxmLmFuaW1hdGVCb3JkZXIoX3NlbGYubGVmdCwgX3NlbGYud2lkdGgpO1xuXHRcdH0pO1xuXG5cdFx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5sb2dvIGEnLCBmdW5jdGlvbigpIHtcblx0XHRcdF9zZWxmLmxhc3RMZWZ0ID0gX3NlbGYubGVmdCA9ICQoX3NlbGYuYWN0aXZlSXRlbSkucGFyZW50cygnbGknKS5wb3NpdGlvbigpLmxlZnQ7XG5cdFx0XHRfc2VsZi5sYXN0V2lkdGggPSBfc2VsZi53aWR0aCA9ICQoX3NlbGYuYWN0aXZlSXRlbSkucGFyZW50cygnbGknKS5vdXRlcldpZHRoKCk7XG5cblxuXG5cdFx0XHRfc2VsZi5hbmltYXRlQm9yZGVyKF9zZWxmLmxlZnQsIF9zZWxmLndpZHRoKTtcblx0XHR9KTtcblx0fSxcblxuXHRzZXREZWZhdWx0UG9zaXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuYW5pbWF0ZUJvcmRlcigkKHRoaXMuYWN0aXZlSXRlbSkucG9zaXRpb24oKS5sZWZ0LCAkKHRoaXMuYWN0aXZlSXRlbSkub3V0ZXJXaWR0aCk7XG5cdH0sXG5cblx0YW5pbWF0ZUJvcmRlcjogZnVuY3Rpb24obGVmdCwgd2lkdGgpIHtcblx0XHQkKHRoaXMuYm9yZGVyKS5hbmltYXRlKHtcblx0XHRcdGxlZnQ6IGxlZnQsXG5cdFx0XHR3aWR0aDogd2lkdGhcblx0XHR9LCAyNTApO1xuXHR9LFxuXG5cdGFwcGVuZEJvcmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0JCh0aGlzLm1lbnUpLmxhc3QoKS5hcHBlbmQoJzxsaSBjbGFzcz1cImJvcmRlclwiPjwvbGk+Jyk7XG5cdFx0dGhpcy5ib3JkZXIgPSAkKHRoaXMubWVudSkuZmluZCgnbGkuYm9yZGVyJyk7XG5cdFx0dGhpcy5ib3JkZXIud2lkdGgoJCh0aGlzLmFjdGl2ZUl0ZW0pLm91dGVyV2lkdGgoKSk7XG5cdH0sXG5cblx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fX3ByZXBhcmVWYXJzKCk7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY3Vyc29yRm9sbG93ZXI7IiwidmFyIGZlYXR1cmVzID0ge1xuXHRzdDogbnVsbCxcblx0c2VhbDogbnVsbCxcblx0aG9yc2U6IG51bGwsXG5cdHByb3NDb25zSXRlbTogbnVsbCxcblx0cHJvc0NvbnNQYXJhZ3JhcGg6IG51bGwsXG5cdHByb3NDb25zUm93OiBudWxsLFxuXG5cdF9fcHJlcGFyZVZhcnM6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc3QgPSBoZWxwZXIuc2Nyb2xsVG9wKCk7XG5cdFx0dGhpcy5zZWFsID0gJy5zZWFsIC5hbmltYWwgaW1nJztcblx0XHR0aGlzLmhvcnNlID0gJy5ob3JzZSAuYW5pbWFsIGltZyc7XG5cblx0XHR0aGlzLnByb3NDb25zUm93ID0gJy5wcm9ibGVtcyAucm93Jztcblx0XHR0aGlzLnByb3NDb25zSXRlbSA9ICcucHJvYmxlbXMgLml0ZW0nO1xuXHRcdHRoaXMucHJvc0NvbnNQYXJhZ3JhcGggPSAnLnByb2JsZW1zIC5pdGVtIHAnO1xuXG5cdFx0dGhpcy5fX2xpc3RlbmVycygpO1xuXHRcdHRoaXMuY29tcGFyZVBhcmVncmFwaEhlaWdodCgpO1xuXG5cdFx0aWYoKCgkKHRoaXMuc2VhbCkub2Zmc2V0KCkudG9wICsgJCh3aW5kb3cpLmhlaWdodCgpLzMpIDwgKHRoaXMuc3QgKyAkKHdpbmRvdykuaGVpZ2h0KCkpKSkge1xuXHRcdFx0dGhpcy5hbmltYXRlRWxlbWVudCh0aGlzLnNlYWwpO1xuXHRcdH1cblx0XHRpZigoKCQodGhpcy5ob3JzZSkub2Zmc2V0KCkudG9wICsgJCh3aW5kb3cpLmhlaWdodCgpLzMpIDwgKHRoaXMuc3QgKyAkKHdpbmRvdykuaGVpZ2h0KCkpKSkge1xuXHRcdFx0dGhpcy5hbmltYXRlRWxlbWVudCh0aGlzLmhvcnNlKTtcblx0XHR9XG5cdH0sXG5cblx0X19saXN0ZW5lcnM6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBfc2VsZiA9IHRoaXM7XG5cblx0XHQkKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5zdCA9IGhlbHBlci5zY3JvbGxUb3AoKTtcblx0XHRcdGlmKCgoJChfc2VsZi5zZWFsKS5vZmZzZXQoKS50b3AgKyAkKHdpbmRvdykuaGVpZ2h0KCkvMykgPCAodGhpcy5zdCArICQod2luZG93KS5oZWlnaHQoKSkpKSB7XG5cdFx0XHRcdF9zZWxmLmFuaW1hdGVFbGVtZW50KF9zZWxmLnNlYWwpO1xuXHRcdFx0fVxuXHRcdFx0aWYoKCgkKF9zZWxmLmhvcnNlKS5vZmZzZXQoKS50b3AgKyAkKHdpbmRvdykuaGVpZ2h0KCkvMykgPCAodGhpcy5zdCArICQod2luZG93KS5oZWlnaHQoKSkpKSB7XG5cdFx0XHRcdF9zZWxmLmFuaW1hdGVFbGVtZW50KF9zZWxmLmhvcnNlKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHRhbmltYXRlRWxlbWVudDogZnVuY3Rpb24oZWwpIHtcblx0XHQkKGVsKS5hbmltYXRlKHtcblx0XHRcdG9wYWNpdHk6IDFcblx0XHR9LCA1MDApO1xuXHR9LFxuXG5cdGNvbXBhcmVQYXJlZ3JhcGhIZWlnaHQ6IGZ1bmN0aW9uKCkge1xuXHRcdGlmKCQodGhpcy5wcm9zQ29uc1JvdykubGVuZ3RoKSB7XG5cdFx0XHQkKHRoaXMucHJvc0NvbnNSb3cpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIHJvdyA9IHRoaXM7XG5cdFx0XHRcdHZhciBoaWdoZXN0Qm94ID0gMDtcblx0XHRcdFx0JChyb3cpLmZpbmQoJ2FydGljbGUnKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0JCh0aGlzKS5maW5kKCdwJykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGlmKCQodGhpcykuaGVpZ2h0KCkgPiBoaWdoZXN0Qm94KVxuXHRcdFx0XHRcdFx0XHRoaWdoZXN0Qm94ID0gJCh0aGlzKS5oZWlnaHQoKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCQocm93KS5maW5kKCdhcnRpY2xlIHAnKS5oZWlnaHQoaGlnaGVzdEJveCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cblx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fX3ByZXBhcmVWYXJzKCk7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZmVhdHVyZXM7IiwiZm9ybVZhbGlkYXRpb24gPSB7XG5cdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdGZ1bmN0aW9uIGhhc0h0bWw1VmFsaWRhdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JykuY2hlY2tWYWxpZGl0eSA9PT0gJ2Z1bmN0aW9uJztcblx0XHR9XG5cblx0XHRpZiAoaGFzSHRtbDVWYWxpZGF0aW9uKCkpIHtcblx0XHRcdCQoJ2Zvcm0nKS5zdWJtaXQoZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0aWYgKCF0aGlzLmNoZWNrVmFsaWRpdHkoKSkge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdpbnZhbGlkJyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcygnaW52YWxpZCcpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JCh0aGlzKS5maW5kKCcuZXJyb3JNZXNzYWdlJykucmVtb3ZlKCk7XG5cdFx0XHRcdCQodGhpcykucHJlcGVuZCgnPGRpdiBjbGFzcz1cImVycm9yTWVzc2FnZVwiPnprb250cm9sdWp0ZSBzcHLDoXZub3N0IHphZGFuw71jaCDDumRhasWvIHUgdnl6bmHEjWVuw71jaCBwb2zDrTwvZGl2PicpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZvcm1WYWxpZGF0aW9uOyIsInZhciBoZWxwZXIgPSB7XG5cdHdpbmRvd1dpZHRoOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJCh3aW5kb3cpLndpZHRoKCk7XG5cdH0sXG5cblx0c2Nyb2xsVG9wOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXHR9LFxuXG5cdHdpbmRvd0hlaWdodDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICQod2luZG93KS5oZWlnaHQoKTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBoZWxwZXI7IiwidGFicyA9IHtcblx0dGFic1dyYXA6IG51bGwsXG5cdGJvb2ttYXJrOiBudWxsLFxuXHRjb250ZW50OiBudWxsLFxuXHRhY3RpdmVDbGFzczogJ2FjdGl2ZScsXG5cdGN1cnJlbnRUYWI6IG51bGwsXG5cdGN1cnJlbnRXcmFwOiBudWxsLFxuXG5cdGVsZW1lbnRzOiB7XG5cdFx0ZWxUYWJzV3JhcDogJy50YWJzJyxcblx0XHRlbEJvb2ttYXJrczogJy50YWJCb29rbWFya3MgLml0ZW0nLFxuXHRcdGVsQ29udGVudDogJy50YWJDb250ZW50J1xuXHR9LFxuXG5cdF9fcHJlcGFyZVZhcnM6IGZ1bmN0aW9uKCkge1xuXHRcdGlmKCQodGhpcy5lbGVtZW50cy5lbFRhYnNXcmFwKS5sZW5ndGgpIHtcblx0XHRcdHRoaXMudGFic1dyYXAgPSB0aGlzLmVsZW1lbnRzLmVsVGFic1dyYXA7XG5cdFx0fVxuXG5cdFx0aWYoJCh0aGlzLmVsZW1lbnRzLmVsQm9va21hcmtzKS5sZW5ndGgpIHtcblx0XHRcdHRoaXMuYm9va21hcmsgPSB0aGlzLmVsZW1lbnRzLmVsQm9va21hcmtzO1xuXHRcdH1cblxuXHRcdGlmKCQodGhpcy5lbGVtZW50cy5lbENvbnRlbnQpLmxlbmd0aCkge1xuXHRcdFx0dGhpcy5jb250ZW50ID0gdGhpcy5lbGVtZW50cy5lbENvbnRlbnQ7XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXREZWZhdWx0QWN0aXZlKCk7XG5cdFx0dGhpcy5fX2xpc3RlbmVycygpO1xuXHR9LFxuXG5cdF9fbGlzdGVuZXJzOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgX3NlbGYgPSB0aGlzO1xuXG5cdFx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5ib29rbWFyaywgZnVuY3Rpb24oKSB7XG5cdFx0XHRfc2VsZi5jdXJyZW50VGFiID0gJCh0aGlzKTtcblx0XHRcdF9zZWxmLmN1cnJlbnRXcmFwID0gJCh0aGlzKS5wYXJlbnRzKF9zZWxmLnRhYnNXcmFwKTtcblx0XHRcdF9zZWxmLnN3aXRjaFRhYnMoKTtcblx0XHR9KTtcblx0fSxcblxuXHRzZXREZWZhdWx0QWN0aXZlOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgX3NlbGYgPSB0aGlzO1xuXG5cdFx0JCh0aGlzLnRhYnNXcmFwKS5lYWNoKGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQkKHRoaXMpLmZpbmQoX3NlbGYuYm9va21hcmspLmZpcnN0KCkuYWRkQ2xhc3MoX3NlbGYuYWN0aXZlQ2xhc3MpO1xuXHRcdFx0JCh0aGlzKS5maW5kKF9zZWxmLmNvbnRlbnQpLmZpcnN0KCkuYWRkQ2xhc3MoX3NlbGYuYWN0aXZlQ2xhc3MpO1xuXHRcdH0pO1xuXHR9LFxuXG5cdHN3aXRjaFRhYnM6IGZ1bmN0aW9uKCkge1xuXHRcdGlmKCF0aGlzLmN1cnJlbnRUYWIuaGFzQ2xhc3ModGhpcy5hY3RpdmVDbGFzcykpIHtcblx0XHRcdCQodGhpcy5jdXJyZW50V3JhcCkuZmluZCh0aGlzLmJvb2ttYXJrICsgJywgJyArIHRoaXMuY29udGVudCkucmVtb3ZlQ2xhc3ModGhpcy5hY3RpdmVDbGFzcyk7XG5cdFx0XHQkKHRoaXMuY3VycmVudFRhYikuYWRkQ2xhc3ModGhpcy5hY3RpdmVDbGFzcyk7XG5cdFx0XHQkKHRoaXMuY29udGVudCArICdbZGF0YS10YWItY29udGVudD1cIicgKyB0aGlzLmN1cnJlbnRUYWIuZGF0YSgndGFiQm9va21hcmsnKSArICdcIl0nKS5hZGRDbGFzcyh0aGlzLmFjdGl2ZUNsYXNzKTtcblx0XHR9XG5cdH0sXG5cblx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fX3ByZXBhcmVWYXJzKCk7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdGFiczsiXX0=
