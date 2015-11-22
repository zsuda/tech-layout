(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
var app = app || {};
var tabs = require('./tabs');
var anchor = require('./anchor');

$(window).on('load', function() {
	tabs.init();
	anchor.init();
});
},{"./anchor":1,"./tabs":3}],3:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvYXNzZXRzL3NjcmlwdHMvYXBwL2FuY2hvci5qcyIsInd3dy9hc3NldHMvc2NyaXB0cy9hcHAvYXBwLmpzIiwid3d3L2Fzc2V0cy9zY3JpcHRzL2FwcC90YWJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiYW5jaG9yID0ge1xuXHRjbGVhckhhc2g6IG51bGwsXG5cdG1lbnVJdGVtczogbnVsbCxcblxuXHRfX3ByZXBhcmVWYXJzOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLm1lbnVJdGVtcyA9ICdoZWFkZXIgbmF2IGEnO1xuXHR9LFxuXG5cdF9fbGlzdGVuZXJzOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgX3NlbGYgPSB0aGlzO1xuXG5cdFx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJ2FbaHJlZio9I10nLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdF9zZWxmLmNsZWFySGFzaCA9ICQodGhpcykuYXR0cignaHJlZicpLnJlcGxhY2UoJyMnLCcnKTtcblx0XHRcdF9zZWxmLnNjcm9sbFRvU2VjdGlvbihfc2VsZi5jbGVhckhhc2gpO1xuXHRcdH0pO1xuXHR9LFxuXG5cdHNjcm9sbFRvU2VjdGlvbjogZnVuY3Rpb24oaGFzaCkge1xuXHRcdHZhciBfc2VsZiA9IHRoaXM7XG5cdFx0dGhpcy5jbGVhckhhc2ggPSBoYXNoLnJlcGxhY2UoJyNfJywgJycpO1xuXG5cdFx0JCgnaHRtbCxib2R5JykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiAkKCcjJyArIHRoaXMuY2xlYXJIYXNoKS5vZmZzZXQoKS50b3B9LCAnc2xvdycsIGZ1bmN0aW9uKCl7XG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcjXycgKyBfc2VsZi5jbGVhckhhc2g7XG5cdFx0fSk7XG5cdFx0dGhpcy5zZXRNZW51SXRlbUFjdGl2ZSgpO1xuXHR9LFxuXG5cdHNldE1lbnVJdGVtQWN0aXZlOiBmdW5jdGlvbigpIHtcblx0XHQkKHRoaXMubWVudUl0ZW1zKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0JCh0aGlzLm1lbnVJdGVtcyArICdbaHJlZio9JyArIHRoaXMuY2xlYXJIYXNoICsgJ10nKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdH0sXG5cblx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0aWYod2luZG93LmxvY2F0aW9uLmhhc2ggIT0gJycpIHtcblx0XHRcdHRoaXMuc2Nyb2xsVG9TZWN0aW9uKHdpbmRvdy5sb2NhdGlvbi5oYXNoKTtcblx0XHR9XG5cblx0XHR0aGlzLl9fcHJlcGFyZVZhcnMoKTtcblx0XHR0aGlzLl9fbGlzdGVuZXJzKCk7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYW5jaG9yOyIsInZhciBhcHAgPSBhcHAgfHwge307XG52YXIgdGFicyA9IHJlcXVpcmUoJy4vdGFicycpO1xudmFyIGFuY2hvciA9IHJlcXVpcmUoJy4vYW5jaG9yJyk7XG5cbiQod2luZG93KS5vbignbG9hZCcsIGZ1bmN0aW9uKCkge1xuXHR0YWJzLmluaXQoKTtcblx0YW5jaG9yLmluaXQoKTtcbn0pOyIsInRhYnMgPSB7XG5cdHRhYnNXcmFwOiBudWxsLFxuXHRib29rbWFyazogbnVsbCxcblx0Y29udGVudDogbnVsbCxcblx0YWN0aXZlQ2xhc3M6ICdhY3RpdmUnLFxuXHRjdXJyZW50VGFiOiBudWxsLFxuXHRjdXJyZW50V3JhcDogbnVsbCxcblxuXHRlbGVtZW50czoge1xuXHRcdGVsVGFic1dyYXA6ICcudGFicycsXG5cdFx0ZWxCb29rbWFya3M6ICcudGFiQm9va21hcmtzIC5pdGVtJyxcblx0XHRlbENvbnRlbnQ6ICcudGFiQ29udGVudCdcblx0fSxcblxuXHRfX3ByZXBhcmVWYXJzOiBmdW5jdGlvbigpIHtcblx0XHRpZigkKHRoaXMuZWxlbWVudHMuZWxUYWJzV3JhcCkubGVuZ3RoKSB7XG5cdFx0XHR0aGlzLnRhYnNXcmFwID0gdGhpcy5lbGVtZW50cy5lbFRhYnNXcmFwO1xuXHRcdH1cblxuXHRcdGlmKCQodGhpcy5lbGVtZW50cy5lbEJvb2ttYXJrcykubGVuZ3RoKSB7XG5cdFx0XHR0aGlzLmJvb2ttYXJrID0gdGhpcy5lbGVtZW50cy5lbEJvb2ttYXJrcztcblx0XHR9XG5cblx0XHRpZigkKHRoaXMuZWxlbWVudHMuZWxDb250ZW50KS5sZW5ndGgpIHtcblx0XHRcdHRoaXMuY29udGVudCA9IHRoaXMuZWxlbWVudHMuZWxDb250ZW50O1xuXHRcdH1cblxuXHRcdHRoaXMuc2V0RGVmYXVsdEFjdGl2ZSgpO1xuXHRcdHRoaXMuX19saXN0ZW5lcnMoKTtcblx0fSxcblxuXHRfX2xpc3RlbmVyczogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIF9zZWxmID0gdGhpcztcblxuXHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuYm9va21hcmssIGZ1bmN0aW9uKCkge1xuXHRcdFx0X3NlbGYuY3VycmVudFRhYiA9ICQodGhpcyk7XG5cdFx0XHRfc2VsZi5jdXJyZW50V3JhcCA9ICQodGhpcykucGFyZW50cyhfc2VsZi50YWJzV3JhcCk7XG5cdFx0XHRfc2VsZi5zd2l0Y2hUYWJzKCk7XG5cdFx0fSk7XG5cdH0sXG5cblx0c2V0RGVmYXVsdEFjdGl2ZTogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIF9zZWxmID0gdGhpcztcblxuXHRcdCQodGhpcy50YWJzV3JhcCkuZWFjaChmdW5jdGlvbigpIHtcblxuXHRcdFx0JCh0aGlzKS5maW5kKF9zZWxmLmJvb2ttYXJrKS5maXJzdCgpLmFkZENsYXNzKF9zZWxmLmFjdGl2ZUNsYXNzKTtcblx0XHRcdCQodGhpcykuZmluZChfc2VsZi5jb250ZW50KS5maXJzdCgpLmFkZENsYXNzKF9zZWxmLmFjdGl2ZUNsYXNzKTtcblx0XHR9KTtcblx0fSxcblxuXHRzd2l0Y2hUYWJzOiBmdW5jdGlvbigpIHtcblx0XHRpZighdGhpcy5jdXJyZW50VGFiLmhhc0NsYXNzKHRoaXMuYWN0aXZlQ2xhc3MpKSB7XG5cdFx0XHQkKHRoaXMuY3VycmVudFdyYXApLmZpbmQodGhpcy5ib29rbWFyayArICcsICcgKyB0aGlzLmNvbnRlbnQpLnJlbW92ZUNsYXNzKHRoaXMuYWN0aXZlQ2xhc3MpO1xuXHRcdFx0JCh0aGlzLmN1cnJlbnRUYWIpLmFkZENsYXNzKHRoaXMuYWN0aXZlQ2xhc3MpO1xuXHRcdFx0JCh0aGlzLmNvbnRlbnQgKyAnW2RhdGEtdGFiLWNvbnRlbnQ9XCInICsgdGhpcy5jdXJyZW50VGFiLmRhdGEoJ3RhYkJvb2ttYXJrJykgKyAnXCJdJykuYWRkQ2xhc3ModGhpcy5hY3RpdmVDbGFzcyk7XG5cdFx0fVxuXHR9LFxuXG5cdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX19wcmVwYXJlVmFycygpO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRhYnM7Il19
