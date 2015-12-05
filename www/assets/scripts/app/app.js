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