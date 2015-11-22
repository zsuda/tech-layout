(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var app = app || {};
var tabs = require('./tabs');

$(window).on('load', function() {
	tabs.init();
});
},{"./tabs":2}],2:[function(require,module,exports){
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
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvYXNzZXRzL3NjcmlwdHMvYXBwL2FwcC5qcyIsInd3dy9hc3NldHMvc2NyaXB0cy9hcHAvdGFicy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBhcHAgPSBhcHAgfHwge307XG52YXIgdGFicyA9IHJlcXVpcmUoJy4vdGFicycpO1xuXG4kKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbigpIHtcblx0dGFicy5pbml0KCk7XG59KTsiLCJ0YWJzID0ge1xuXHR0YWJzV3JhcDogbnVsbCxcblx0Ym9va21hcms6IG51bGwsXG5cdGNvbnRlbnQ6IG51bGwsXG5cdGFjdGl2ZUNsYXNzOiAnYWN0aXZlJyxcblx0Y3VycmVudFRhYjogbnVsbCxcblx0Y3VycmVudFdyYXA6IG51bGwsXG5cblx0ZWxlbWVudHM6IHtcblx0XHRlbFRhYnNXcmFwOiAnLnRhYnMnLFxuXHRcdGVsQm9va21hcmtzOiAnLnRhYkJvb2ttYXJrcyAuaXRlbScsXG5cdFx0ZWxDb250ZW50OiAnLnRhYkNvbnRlbnQnXG5cdH0sXG5cblx0X19wcmVwYXJlVmFyczogZnVuY3Rpb24oKSB7XG5cdFx0aWYoJCh0aGlzLmVsZW1lbnRzLmVsVGFic1dyYXApLmxlbmd0aCkge1xuXHRcdFx0dGhpcy50YWJzV3JhcCA9IHRoaXMuZWxlbWVudHMuZWxUYWJzV3JhcDtcblx0XHR9XG5cblx0XHRpZigkKHRoaXMuZWxlbWVudHMuZWxCb29rbWFya3MpLmxlbmd0aCkge1xuXHRcdFx0dGhpcy5ib29rbWFyayA9IHRoaXMuZWxlbWVudHMuZWxCb29rbWFya3M7XG5cdFx0fVxuXG5cdFx0aWYoJCh0aGlzLmVsZW1lbnRzLmVsQ29udGVudCkubGVuZ3RoKSB7XG5cdFx0XHR0aGlzLmNvbnRlbnQgPSB0aGlzLmVsZW1lbnRzLmVsQ29udGVudDtcblx0XHR9XG5cblx0XHR0aGlzLnNldERlZmF1bHRBY3RpdmUoKTtcblx0XHR0aGlzLl9fbGlzdGVuZXJzKCk7XG5cdH0sXG5cblx0X19saXN0ZW5lcnM6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBfc2VsZiA9IHRoaXM7XG5cblx0XHQkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLmJvb2ttYXJrLCBmdW5jdGlvbigpIHtcblx0XHRcdF9zZWxmLmN1cnJlbnRUYWIgPSAkKHRoaXMpO1xuXHRcdFx0X3NlbGYuY3VycmVudFdyYXAgPSAkKHRoaXMpLnBhcmVudHMoX3NlbGYudGFic1dyYXApO1xuXHRcdFx0X3NlbGYuc3dpdGNoVGFicygpO1xuXHRcdH0pO1xuXHR9LFxuXG5cdHNldERlZmF1bHRBY3RpdmU6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBfc2VsZiA9IHRoaXM7XG5cblx0XHQkKHRoaXMudGFic1dyYXApLmVhY2goZnVuY3Rpb24oKSB7XG5cblx0XHRcdCQodGhpcykuZmluZChfc2VsZi5ib29rbWFyaykuZmlyc3QoKS5hZGRDbGFzcyhfc2VsZi5hY3RpdmVDbGFzcyk7XG5cdFx0XHQkKHRoaXMpLmZpbmQoX3NlbGYuY29udGVudCkuZmlyc3QoKS5hZGRDbGFzcyhfc2VsZi5hY3RpdmVDbGFzcyk7XG5cdFx0fSk7XG5cdH0sXG5cblx0c3dpdGNoVGFiczogZnVuY3Rpb24oKSB7XG5cdFx0aWYoIXRoaXMuY3VycmVudFRhYi5oYXNDbGFzcyh0aGlzLmFjdGl2ZUNsYXNzKSkge1xuXHRcdFx0JCh0aGlzLmN1cnJlbnRXcmFwKS5maW5kKHRoaXMuYm9va21hcmsgKyAnLCAnICsgdGhpcy5jb250ZW50KS5yZW1vdmVDbGFzcyh0aGlzLmFjdGl2ZUNsYXNzKTtcblx0XHRcdCQodGhpcy5jdXJyZW50VGFiKS5hZGRDbGFzcyh0aGlzLmFjdGl2ZUNsYXNzKTtcblx0XHRcdCQodGhpcy5jb250ZW50ICsgJ1tkYXRhLXRhYi1jb250ZW50PVwiJyArIHRoaXMuY3VycmVudFRhYi5kYXRhKCd0YWJCb29rbWFyaycpICsgJ1wiXScpLmFkZENsYXNzKHRoaXMuYWN0aXZlQ2xhc3MpO1xuXHRcdH1cblx0fSxcblxuXHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLl9fcHJlcGFyZVZhcnMoKTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB0YWJzOyJdfQ==
