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