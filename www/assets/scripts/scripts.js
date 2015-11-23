(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

	__prepareVars: function() {
		this.st = helper.scrollTop();
		this.seal = '.seal .animal img';
		this.horse = '.horse .animal img';

		this.__listeners();

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

	init: function() {
		this.__prepareVars();
	}
};

module.exports = features;
},{}],5:[function(require,module,exports){
var formValidation = {
	form: null,
	input: null,
	mail: null,
	date: null,
	button: null,

	//__prepareVars: function() {
	//	this.form = 'form';
	//	this.input = 'input:not("mail"), input:not("date")';
	//	this.mail = 'input.mail';
	//	this.date = 'input.date';
	//},

	__listeners: function() {
		var _self = this;

		$(document).on('blur', 'input, textarea', function() {
			_self.validateLength(this);
		});

		$(document).on('blur', 'input.mail', function() {
			_self.validateMail(this);
		});

		$(document).on('click', 'input[type=submit]', function() {
			_self.validateForm(this);
		});
	},

	validateLength: function(el) {
		if(!$(el).hasClass('error') && $(el).val().length <= 3) {
			this.showError(el);
		}
		else if($(el).val().length > 3){
			this.removeError(el);
		}
	},

	validateMail: function(el) {
		var mail = $(el).val();
		var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

		if(!re.test(mail)) {
			$(el).data('errormsg', 'E-mail není ve správném tvaru');
			this.showError(el);
		}
		else {
			this.removeError(el);
		}
	},

	validateForm: function(el) {
		//el.preventDefault();
		var _self = this;
		var parentForm = $(el).closest('form');

		parentForm.find('input[type!=submit], textarea').each(function() {
			_self.validateLength($(this));
		});

		if(parentForm.find('.error').length == 0) {
			$(parentForm).submit(function(e) {
				var url = "http://www.zdenek.suda.cz/do.php";

				$.ajax({
					type: "POST",
					url: url,
					data: $(this).serialize(),
					crossDomain: true,
					success: function(data)
					{
						console.log(data);
					},

					error: function(data)
					{
						console.log(data);
					}
				});
				e.preventDefault();
			});

		}
	},

	showError: function(el) {
		var errorMsg = $(el).data('errormsg');
		$(el).addClass('error').after('<div class="errorMessage">' + errorMsg + '</div>');
	},

	removeError: function(el) {
		$(el).removeClass('error').next().remove();
	},

	init: function() {
		this.__listeners();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvYXNzZXRzL3NjcmlwdHMvYXBwL2FuY2hvci5qcyIsInd3dy9hc3NldHMvc2NyaXB0cy9hcHAvYXBwLmpzIiwid3d3L2Fzc2V0cy9zY3JpcHRzL2FwcC9jdXJzb3JGb2xsb3dlci5qcyIsInd3dy9hc3NldHMvc2NyaXB0cy9hcHAvZmVhdHVyZXMuanMiLCJ3d3cvYXNzZXRzL3NjcmlwdHMvYXBwL2Zvcm1WYWxpZGF0aW9uLmpzIiwid3d3L2Fzc2V0cy9zY3JpcHRzL2FwcC9oZWxwZXIuanMiLCJ3d3cvYXNzZXRzL3NjcmlwdHMvYXBwL3RhYnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImFuY2hvciA9IHtcblx0Y2xlYXJIYXNoOiBudWxsLFxuXHRtZW51SXRlbXM6IG51bGwsXG5cdGhlYWRlck9mZnNldDogMCxcblx0aXNBbmltYXRlZDogZmFsc2UsXG5cblx0X19wcmVwYXJlVmFyczogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5tZW51SXRlbXMgPSAnaGVhZGVyIG5hdiBhJztcblxuXHRcdHRoaXMuc2V0SGVhZGVyT2Zmc2V0KCk7XG5cdH0sXG5cblx0X19saXN0ZW5lcnM6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBfc2VsZiA9IHRoaXM7XG5cblx0XHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnYVtocmVmKj0jXScsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0aWYoX3NlbGYuaXNBbmltYXRlZCA9PSBmYWxzZSkge1xuXHRcdFx0XHRfc2VsZi5pc0FuaW1hdGVkID0gdHJ1ZTtcblx0XHRcdFx0X3NlbGYuY2xlYXJIYXNoID0gJCh0aGlzKS5hdHRyKCdocmVmJykucmVwbGFjZSgnIycsJycpO1xuXHRcdFx0XHRfc2VsZi5zY3JvbGxUb1NlY3Rpb24oX3NlbGYuY2xlYXJIYXNoKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdCQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRfc2VsZi5zZXRIZWFkZXJPZmZzZXQoKTtcblx0XHR9KTtcblx0fSxcblxuXHRzZXRIZWFkZXJPZmZzZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdGlmKHdpbmRvdy5oZWxwZXIud2luZG93V2lkdGgoKSA8IDk5MCkge1xuXHRcdFx0dGhpcy5oZWFkZXJPZmZzZXQgPSA4ODtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aGlzLmhlYWRlck9mZnNldCA9IDA7XG5cdFx0fVxuXHR9LFxuXG5cdHNjcm9sbFRvU2VjdGlvbjogZnVuY3Rpb24oaGFzaCkge1xuXHRcdHZhciBfc2VsZiA9IHRoaXM7XG5cdFx0dGhpcy5jbGVhckhhc2ggPSBoYXNoLnJlcGxhY2UoJyNfJywgJycpO1xuXG5cdFx0dmFyIG9mZnNldCA9ICQoJyMnICsgdGhpcy5jbGVhckhhc2gpLm9mZnNldCgpLnRvcDtcblxuXHRcdCQoJ2h0bWwsYm9keScpLmFuaW1hdGUoe3Njcm9sbFRvcDogb2Zmc2V0fSwgJ3Nsb3cnLCBmdW5jdGlvbigpe1xuXHRcdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSAnI18nICsgX3NlbGYuY2xlYXJIYXNoO1xuXHRcdFx0X3NlbGYuaXNBbmltYXRlZCA9IGZhbHNlO1xuXHRcdH0pO1xuXHRcdHRoaXMuc2V0TWVudUl0ZW1BY3RpdmUoKTtcblx0fSxcblxuXHRzZXRNZW51SXRlbUFjdGl2ZTogZnVuY3Rpb24oKSB7XG5cdFx0JCh0aGlzLm1lbnVJdGVtcykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdGlmKHRoaXMuY2xlYXJIYXNoICE9ICdob21lJykge1xuXHRcdFx0JCh0aGlzLm1lbnVJdGVtcyArICdbaHJlZio9JyArIHRoaXMuY2xlYXJIYXNoICsgJ10nKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0JCh0aGlzLm1lbnVJdGVtcykuZmlyc3QoKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0fVxuXHR9LFxuXG5cdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX19wcmVwYXJlVmFycygpO1xuXHRcdHRoaXMuc2V0SGVhZGVyT2Zmc2V0KCk7XG5cblx0XHRpZigod2luZG93LmxvY2F0aW9uLmhhc2ggIT0gJycpKSB7XG5cdFx0XHR0aGlzLnNjcm9sbFRvU2VjdGlvbih3aW5kb3cubG9jYXRpb24uaGFzaCk7XG5cdFx0XHQkKHRoaXMubWVudUl0ZW1zICsgJ1tocmVmKj0nICsgd2luZG93LmxvY2F0aW9uLmhhc2ggKyAnXScpLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHQkKHRoaXMubWVudUl0ZW1zKS5maXJzdCgpLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHR9XG5cblx0XHR0aGlzLl9fbGlzdGVuZXJzKCk7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYW5jaG9yOyIsInZhciBhcHAgPSBhcHAgfHwge307XG52YXIgaGVscGVyID0gcmVxdWlyZSgnLi9oZWxwZXInKTtcbnZhciBmb3JtVmFsaWRhdGlvbiA9IHJlcXVpcmUoJy4vZm9ybVZhbGlkYXRpb24nKTtcbnZhciB0YWJzID0gcmVxdWlyZSgnLi90YWJzJyk7XG52YXIgYW5jaG9yID0gcmVxdWlyZSgnLi9hbmNob3InKTtcbnZhciBjdXJzb3JGb2xsb3dlciA9IHJlcXVpcmUoJy4vY3Vyc29yRm9sbG93ZXInKTtcbnZhciBmZWF0dXJlcyA9IHJlcXVpcmUoJy4vZmVhdHVyZXMnKTtcblxuJCh3aW5kb3cpLm9uKCdsb2FkJywgZnVuY3Rpb24oKSB7XG5cdHdpbmRvdy5oZWxwZXIgPSBoZWxwZXI7XG5cdHRhYnMuaW5pdCgpO1xuXHRhbmNob3IuaW5pdCgpO1xuXHRjdXJzb3JGb2xsb3dlci5pbml0KCk7XG5cdGZvcm1WYWxpZGF0aW9uLmluaXQoKTtcblx0ZmVhdHVyZXMuaW5pdCgpO1xufSk7IiwiY3Vyc29yRm9sbG93ZXIgPSB7XG5cdG1lbnU6IG51bGwsXG5cdGl0ZW06IG51bGwsXG5cdGFjdGl2ZUl0ZW06IG51bGwsXG5cdGJvcmRlcjogbnVsbCxcblx0bGVmdDogMCxcblx0d2lkdGg6IDAsXG5cdGxhc3RMZWZ0OiAwLFxuXHRsYXN0V2lkdGg6IDAsXG5cblx0X19wcmVwYXJlVmFyczogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5tZW51ID0gJy5oZWFkZXIgbmF2IHVsJztcblx0XHR0aGlzLml0ZW0gPSB0aGlzLm1lbnUgKyAnIGEnO1xuXHRcdHRoaXMuYWN0aXZlSXRlbSA9IHRoaXMubWVudSArICcgYS5hY3RpdmUnO1xuXG5cdFx0dGhpcy5hcHBlbmRCb3JkZXIoKTtcblx0XHR0aGlzLnNldERlZmF1bHRQb3NpdGlvbigpO1xuXHRcdHRoaXMuX19saXN0ZW5lcnMoKTtcblx0fSxcblxuXHRfX2xpc3RlbmVyczogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIF9zZWxmID0gdGhpcztcblxuXHRcdCQoZG9jdW1lbnQpLm9uKCdtb3VzZWVudGVyJywgdGhpcy5pdGVtLCBmdW5jdGlvbigpIHtcblx0XHRcdF9zZWxmLmxhc3RMZWZ0ID0gJChfc2VsZi5hY3RpdmVJdGVtKS5wYXJlbnRzKCdsaScpLnBvc2l0aW9uKCkubGVmdDtcblx0XHRcdF9zZWxmLmxhc3RXaWR0aCA9ICQoX3NlbGYuYWN0aXZlSXRlbSkucGFyZW50cygnbGknKS5vdXRlcldpZHRoKCk7XG5cdFx0XHRfc2VsZi5sZWZ0ID0gJCh0aGlzKS5wYXJlbnRzKCdsaScpLnBvc2l0aW9uKCkubGVmdDtcblx0XHRcdF9zZWxmLndpZHRoID0gJCh0aGlzKS5wYXJlbnRzKCdsaScpLm91dGVyV2lkdGgoKTtcblxuXHRcdFx0X3NlbGYuYW5pbWF0ZUJvcmRlcihfc2VsZi5sZWZ0LCBfc2VsZi53aWR0aCk7XG5cdFx0fSk7XG5cblx0XHQkKGRvY3VtZW50KS5vbignbW91c2VsZWF2ZScsIHRoaXMubWVudSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRfc2VsZi5hbmltYXRlQm9yZGVyKF9zZWxmLmxhc3RMZWZ0LCBfc2VsZi5sYXN0V2lkdGgpO1xuXHRcdH0pO1xuXG5cdFx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5pdGVtLCBmdW5jdGlvbigpIHtcblx0XHRcdF9zZWxmLmxhc3RMZWZ0ID0gX3NlbGYubGVmdCA9ICQodGhpcykucGFyZW50cygnbGknKS5wb3NpdGlvbigpLmxlZnQ7XG5cdFx0XHRfc2VsZi5sYXN0V2lkdGggPSBfc2VsZi53aWR0aCA9ICQodGhpcykucGFyZW50cygnbGknKS5vdXRlcldpZHRoKCk7XG5cdFx0XHRfc2VsZi5hbmltYXRlQm9yZGVyKF9zZWxmLmxlZnQsIF9zZWxmLndpZHRoKTtcblx0XHR9KTtcblxuXHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcubG9nbyBhJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRfc2VsZi5sYXN0TGVmdCA9IF9zZWxmLmxlZnQgPSAkKF9zZWxmLmFjdGl2ZUl0ZW0pLnBhcmVudHMoJ2xpJykucG9zaXRpb24oKS5sZWZ0O1xuXHRcdFx0X3NlbGYubGFzdFdpZHRoID0gX3NlbGYud2lkdGggPSAkKF9zZWxmLmFjdGl2ZUl0ZW0pLnBhcmVudHMoJ2xpJykub3V0ZXJXaWR0aCgpO1xuXG5cblxuXHRcdFx0X3NlbGYuYW5pbWF0ZUJvcmRlcihfc2VsZi5sZWZ0LCBfc2VsZi53aWR0aCk7XG5cdFx0fSk7XG5cdH0sXG5cblx0c2V0RGVmYXVsdFBvc2l0aW9uOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmFuaW1hdGVCb3JkZXIoJCh0aGlzLmFjdGl2ZUl0ZW0pLnBvc2l0aW9uKCkubGVmdCwgJCh0aGlzLmFjdGl2ZUl0ZW0pLm91dGVyV2lkdGgpO1xuXHR9LFxuXG5cdGFuaW1hdGVCb3JkZXI6IGZ1bmN0aW9uKGxlZnQsIHdpZHRoKSB7XG5cdFx0JCh0aGlzLmJvcmRlcikuYW5pbWF0ZSh7XG5cdFx0XHRsZWZ0OiBsZWZ0LFxuXHRcdFx0d2lkdGg6IHdpZHRoXG5cdFx0fSwgMjUwKTtcblx0fSxcblxuXHRhcHBlbmRCb3JkZXI6IGZ1bmN0aW9uKCkge1xuXHRcdCQodGhpcy5tZW51KS5sYXN0KCkuYXBwZW5kKCc8bGkgY2xhc3M9XCJib3JkZXJcIj48L2xpPicpO1xuXHRcdHRoaXMuYm9yZGVyID0gJCh0aGlzLm1lbnUpLmZpbmQoJ2xpLmJvcmRlcicpO1xuXHRcdHRoaXMuYm9yZGVyLndpZHRoKCQodGhpcy5hY3RpdmVJdGVtKS5vdXRlcldpZHRoKCkpO1xuXHR9LFxuXG5cdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX19wcmVwYXJlVmFycygpO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGN1cnNvckZvbGxvd2VyOyIsInZhciBmZWF0dXJlcyA9IHtcblx0c3Q6IG51bGwsXG5cdHNlYWw6IG51bGwsXG5cdGhvcnNlOiBudWxsLFxuXG5cdF9fcHJlcGFyZVZhcnM6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc3QgPSBoZWxwZXIuc2Nyb2xsVG9wKCk7XG5cdFx0dGhpcy5zZWFsID0gJy5zZWFsIC5hbmltYWwgaW1nJztcblx0XHR0aGlzLmhvcnNlID0gJy5ob3JzZSAuYW5pbWFsIGltZyc7XG5cblx0XHR0aGlzLl9fbGlzdGVuZXJzKCk7XG5cblx0XHRpZigoKCQodGhpcy5zZWFsKS5vZmZzZXQoKS50b3AgKyAkKHdpbmRvdykuaGVpZ2h0KCkvMykgPCAodGhpcy5zdCArICQod2luZG93KS5oZWlnaHQoKSkpKSB7XG5cdFx0XHR0aGlzLmFuaW1hdGVFbGVtZW50KHRoaXMuc2VhbCk7XG5cdFx0fVxuXHRcdGlmKCgoJCh0aGlzLmhvcnNlKS5vZmZzZXQoKS50b3AgKyAkKHdpbmRvdykuaGVpZ2h0KCkvMykgPCAodGhpcy5zdCArICQod2luZG93KS5oZWlnaHQoKSkpKSB7XG5cdFx0XHR0aGlzLmFuaW1hdGVFbGVtZW50KHRoaXMuaG9yc2UpO1xuXHRcdH1cblx0fSxcblxuXHRfX2xpc3RlbmVyczogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIF9zZWxmID0gdGhpcztcblxuXHRcdCQod2luZG93KS5vbignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLnN0ID0gaGVscGVyLnNjcm9sbFRvcCgpO1xuXHRcdFx0aWYoKCgkKF9zZWxmLnNlYWwpLm9mZnNldCgpLnRvcCArICQod2luZG93KS5oZWlnaHQoKS8zKSA8ICh0aGlzLnN0ICsgJCh3aW5kb3cpLmhlaWdodCgpKSkpIHtcblx0XHRcdFx0X3NlbGYuYW5pbWF0ZUVsZW1lbnQoX3NlbGYuc2VhbCk7XG5cdFx0XHR9XG5cdFx0XHRpZigoKCQoX3NlbGYuaG9yc2UpLm9mZnNldCgpLnRvcCArICQod2luZG93KS5oZWlnaHQoKS8zKSA8ICh0aGlzLnN0ICsgJCh3aW5kb3cpLmhlaWdodCgpKSkpIHtcblx0XHRcdFx0X3NlbGYuYW5pbWF0ZUVsZW1lbnQoX3NlbGYuaG9yc2UpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXG5cdGFuaW1hdGVFbGVtZW50OiBmdW5jdGlvbihlbCkge1xuXHRcdCQoZWwpLmFuaW1hdGUoe1xuXHRcdFx0b3BhY2l0eTogMVxuXHRcdH0sIDUwMCk7XG5cdH0sXG5cblx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fX3ByZXBhcmVWYXJzKCk7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZmVhdHVyZXM7IiwidmFyIGZvcm1WYWxpZGF0aW9uID0ge1xuXHRmb3JtOiBudWxsLFxuXHRpbnB1dDogbnVsbCxcblx0bWFpbDogbnVsbCxcblx0ZGF0ZTogbnVsbCxcblx0YnV0dG9uOiBudWxsLFxuXG5cdC8vX19wcmVwYXJlVmFyczogZnVuY3Rpb24oKSB7XG5cdC8vXHR0aGlzLmZvcm0gPSAnZm9ybSc7XG5cdC8vXHR0aGlzLmlucHV0ID0gJ2lucHV0Om5vdChcIm1haWxcIiksIGlucHV0Om5vdChcImRhdGVcIiknO1xuXHQvL1x0dGhpcy5tYWlsID0gJ2lucHV0Lm1haWwnO1xuXHQvL1x0dGhpcy5kYXRlID0gJ2lucHV0LmRhdGUnO1xuXHQvL30sXG5cblx0X19saXN0ZW5lcnM6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBfc2VsZiA9IHRoaXM7XG5cblx0XHQkKGRvY3VtZW50KS5vbignYmx1cicsICdpbnB1dCwgdGV4dGFyZWEnLCBmdW5jdGlvbigpIHtcblx0XHRcdF9zZWxmLnZhbGlkYXRlTGVuZ3RoKHRoaXMpO1xuXHRcdH0pO1xuXG5cdFx0JChkb2N1bWVudCkub24oJ2JsdXInLCAnaW5wdXQubWFpbCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0X3NlbGYudmFsaWRhdGVNYWlsKHRoaXMpO1xuXHRcdH0pO1xuXG5cdFx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJ2lucHV0W3R5cGU9c3VibWl0XScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0X3NlbGYudmFsaWRhdGVGb3JtKHRoaXMpO1xuXHRcdH0pO1xuXHR9LFxuXG5cdHZhbGlkYXRlTGVuZ3RoOiBmdW5jdGlvbihlbCkge1xuXHRcdGlmKCEkKGVsKS5oYXNDbGFzcygnZXJyb3InKSAmJiAkKGVsKS52YWwoKS5sZW5ndGggPD0gMykge1xuXHRcdFx0dGhpcy5zaG93RXJyb3IoZWwpO1xuXHRcdH1cblx0XHRlbHNlIGlmKCQoZWwpLnZhbCgpLmxlbmd0aCA+IDMpe1xuXHRcdFx0dGhpcy5yZW1vdmVFcnJvcihlbCk7XG5cdFx0fVxuXHR9LFxuXG5cdHZhbGlkYXRlTWFpbDogZnVuY3Rpb24oZWwpIHtcblx0XHR2YXIgbWFpbCA9ICQoZWwpLnZhbCgpO1xuXHRcdHZhciByZSA9IC9eKFtcXHctXSsoPzpcXC5bXFx3LV0rKSopQCgoPzpbXFx3LV0rXFwuKSpcXHdbXFx3LV17MCw2Nn0pXFwuKFthLXpdezIsNn0oPzpcXC5bYS16XXsyfSk/KSQvaTtcblxuXHRcdGlmKCFyZS50ZXN0KG1haWwpKSB7XG5cdFx0XHQkKGVsKS5kYXRhKCdlcnJvcm1zZycsICdFLW1haWwgbmVuw60gdmUgc3Byw6F2bsOpbSB0dmFydScpO1xuXHRcdFx0dGhpcy5zaG93RXJyb3IoZWwpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMucmVtb3ZlRXJyb3IoZWwpO1xuXHRcdH1cblx0fSxcblxuXHR2YWxpZGF0ZUZvcm06IGZ1bmN0aW9uKGVsKSB7XG5cdFx0Ly9lbC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHZhciBfc2VsZiA9IHRoaXM7XG5cdFx0dmFyIHBhcmVudEZvcm0gPSAkKGVsKS5jbG9zZXN0KCdmb3JtJyk7XG5cblx0XHRwYXJlbnRGb3JtLmZpbmQoJ2lucHV0W3R5cGUhPXN1Ym1pdF0sIHRleHRhcmVhJykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdF9zZWxmLnZhbGlkYXRlTGVuZ3RoKCQodGhpcykpO1xuXHRcdH0pO1xuXG5cdFx0aWYocGFyZW50Rm9ybS5maW5kKCcuZXJyb3InKS5sZW5ndGggPT0gMCkge1xuXHRcdFx0JChwYXJlbnRGb3JtKS5zdWJtaXQoZnVuY3Rpb24oZSkge1xuXHRcdFx0XHR2YXIgdXJsID0gXCJodHRwOi8vd3d3LnpkZW5lay5zdWRhLmN6L2RvLnBocFwiO1xuXG5cdFx0XHRcdCQuYWpheCh7XG5cdFx0XHRcdFx0dHlwZTogXCJQT1NUXCIsXG5cdFx0XHRcdFx0dXJsOiB1cmwsXG5cdFx0XHRcdFx0ZGF0YTogJCh0aGlzKS5zZXJpYWxpemUoKSxcblx0XHRcdFx0XHRjcm9zc0RvbWFpbjogdHJ1ZSxcblx0XHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbihkYXRhKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGRhdGEpO1xuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHRlcnJvcjogZnVuY3Rpb24oZGF0YSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhkYXRhKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9KTtcblxuXHRcdH1cblx0fSxcblxuXHRzaG93RXJyb3I6IGZ1bmN0aW9uKGVsKSB7XG5cdFx0dmFyIGVycm9yTXNnID0gJChlbCkuZGF0YSgnZXJyb3Jtc2cnKTtcblx0XHQkKGVsKS5hZGRDbGFzcygnZXJyb3InKS5hZnRlcignPGRpdiBjbGFzcz1cImVycm9yTWVzc2FnZVwiPicgKyBlcnJvck1zZyArICc8L2Rpdj4nKTtcblx0fSxcblxuXHRyZW1vdmVFcnJvcjogZnVuY3Rpb24oZWwpIHtcblx0XHQkKGVsKS5yZW1vdmVDbGFzcygnZXJyb3InKS5uZXh0KCkucmVtb3ZlKCk7XG5cdH0sXG5cblx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fX2xpc3RlbmVycygpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZm9ybVZhbGlkYXRpb247IiwidmFyIGhlbHBlciA9IHtcblx0d2luZG93V2lkdGg6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAkKHdpbmRvdykud2lkdGgoKTtcblx0fSxcblxuXHRzY3JvbGxUb3A6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaGVscGVyOyIsInRhYnMgPSB7XG5cdHRhYnNXcmFwOiBudWxsLFxuXHRib29rbWFyazogbnVsbCxcblx0Y29udGVudDogbnVsbCxcblx0YWN0aXZlQ2xhc3M6ICdhY3RpdmUnLFxuXHRjdXJyZW50VGFiOiBudWxsLFxuXHRjdXJyZW50V3JhcDogbnVsbCxcblxuXHRlbGVtZW50czoge1xuXHRcdGVsVGFic1dyYXA6ICcudGFicycsXG5cdFx0ZWxCb29rbWFya3M6ICcudGFiQm9va21hcmtzIC5pdGVtJyxcblx0XHRlbENvbnRlbnQ6ICcudGFiQ29udGVudCdcblx0fSxcblxuXHRfX3ByZXBhcmVWYXJzOiBmdW5jdGlvbigpIHtcblx0XHRpZigkKHRoaXMuZWxlbWVudHMuZWxUYWJzV3JhcCkubGVuZ3RoKSB7XG5cdFx0XHR0aGlzLnRhYnNXcmFwID0gdGhpcy5lbGVtZW50cy5lbFRhYnNXcmFwO1xuXHRcdH1cblxuXHRcdGlmKCQodGhpcy5lbGVtZW50cy5lbEJvb2ttYXJrcykubGVuZ3RoKSB7XG5cdFx0XHR0aGlzLmJvb2ttYXJrID0gdGhpcy5lbGVtZW50cy5lbEJvb2ttYXJrcztcblx0XHR9XG5cblx0XHRpZigkKHRoaXMuZWxlbWVudHMuZWxDb250ZW50KS5sZW5ndGgpIHtcblx0XHRcdHRoaXMuY29udGVudCA9IHRoaXMuZWxlbWVudHMuZWxDb250ZW50O1xuXHRcdH1cblxuXHRcdHRoaXMuc2V0RGVmYXVsdEFjdGl2ZSgpO1xuXHRcdHRoaXMuX19saXN0ZW5lcnMoKTtcblx0fSxcblxuXHRfX2xpc3RlbmVyczogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIF9zZWxmID0gdGhpcztcblxuXHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuYm9va21hcmssIGZ1bmN0aW9uKCkge1xuXHRcdFx0X3NlbGYuY3VycmVudFRhYiA9ICQodGhpcyk7XG5cdFx0XHRfc2VsZi5jdXJyZW50V3JhcCA9ICQodGhpcykucGFyZW50cyhfc2VsZi50YWJzV3JhcCk7XG5cdFx0XHRfc2VsZi5zd2l0Y2hUYWJzKCk7XG5cdFx0fSk7XG5cdH0sXG5cblx0c2V0RGVmYXVsdEFjdGl2ZTogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIF9zZWxmID0gdGhpcztcblxuXHRcdCQodGhpcy50YWJzV3JhcCkuZWFjaChmdW5jdGlvbigpIHtcblxuXHRcdFx0JCh0aGlzKS5maW5kKF9zZWxmLmJvb2ttYXJrKS5maXJzdCgpLmFkZENsYXNzKF9zZWxmLmFjdGl2ZUNsYXNzKTtcblx0XHRcdCQodGhpcykuZmluZChfc2VsZi5jb250ZW50KS5maXJzdCgpLmFkZENsYXNzKF9zZWxmLmFjdGl2ZUNsYXNzKTtcblx0XHR9KTtcblx0fSxcblxuXHRzd2l0Y2hUYWJzOiBmdW5jdGlvbigpIHtcblx0XHRpZighdGhpcy5jdXJyZW50VGFiLmhhc0NsYXNzKHRoaXMuYWN0aXZlQ2xhc3MpKSB7XG5cdFx0XHQkKHRoaXMuY3VycmVudFdyYXApLmZpbmQodGhpcy5ib29rbWFyayArICcsICcgKyB0aGlzLmNvbnRlbnQpLnJlbW92ZUNsYXNzKHRoaXMuYWN0aXZlQ2xhc3MpO1xuXHRcdFx0JCh0aGlzLmN1cnJlbnRUYWIpLmFkZENsYXNzKHRoaXMuYWN0aXZlQ2xhc3MpO1xuXHRcdFx0JCh0aGlzLmNvbnRlbnQgKyAnW2RhdGEtdGFiLWNvbnRlbnQ9XCInICsgdGhpcy5jdXJyZW50VGFiLmRhdGEoJ3RhYkJvb2ttYXJrJykgKyAnXCJdJykuYWRkQ2xhc3ModGhpcy5hY3RpdmVDbGFzcyk7XG5cdFx0fVxuXHR9LFxuXG5cdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX19wcmVwYXJlVmFycygpO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRhYnM7Il19
