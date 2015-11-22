var app = app || {};
var tabs = require('./tabs');

$(window).on('load', function() {
	tabs.init();
});