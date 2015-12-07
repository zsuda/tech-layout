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