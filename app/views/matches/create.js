var _ = require('underscore');
var BaseView = require('../base');

module.exports = BaseView.extend({
    className: 'matches_create_view',

    /**
     * Append Activities to template data
     * @return JSON data of template data (models, meta, params)
     * appended with activities collection.
     */
    getTemplateData: function () {
        "use strict";
        return _.extend(
            BaseView.prototype.getTemplateData.apply(this, arguments),
            {activities: this.options.activities.toJSON()}
        );
    }
});
module.exports.id = 'matches/create';
