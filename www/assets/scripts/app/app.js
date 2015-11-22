var app = app || {};
var tabs = require('./tabs');
var anchor = require('./anchor');

$(window).on('load', function() {
	tabs.init();
	anchor.init();
});