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