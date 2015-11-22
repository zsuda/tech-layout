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