/**
* We inject the Handlebars instance, because this module doesn't know where
* the actual Handlebars instance will come from.
*/
module.exports = function (Handlebars) {
    "use strict";
    return {
        copyright: function (year) {
            return new Handlebars.SafeString("&copy;" + year);
        },
        debug: function (options) {
            console.log(this, options);
        }
    };
};
