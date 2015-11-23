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