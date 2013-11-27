var _ = require('underscore'),
    BaseView = require('../base');

module.exports = BaseView.extend({
    tagName: 'nav',
    className: 'shared_navigation_view',

    events: {
        'click .nav-tabs a.tab-link': function (e) {
            "use strict";
            e.preventDefault();
            this.app.router.navigate(this.$(e.target).data('tab'), {trigger: true});
        }
    },

    postInitialize: function () {
        "use strict";
        if (this.app.router) {
            this.app.router.on('action:start', function (route) {
                this.$('ul > li').removeClass('active');
                this.$('li#tab-' + route.controller).addClass('active');
            }, this);
        }
    },

    getTemplateData: function () {
        "use strict";
        return _.extend(
            BaseView.prototype.getTemplateData.apply(this, arguments),
            this.app.req.res.locals
        );
    }
});
module.exports.id = 'shared/navigation';
