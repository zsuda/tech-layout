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