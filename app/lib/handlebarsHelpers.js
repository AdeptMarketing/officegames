/**
* We inject the Handlebars instance, because this module doesn't know where
* the actual Handlebars instance will come from.
*/
module.exports = function (Handlebars) {
    "use strict";
    Handlebars.registerHelper("debug", function (optionalValue) {
        console.log("Current Context");
        console.log("====================");
        console.log(this);

        if (optionalValue) {
            console.log("Value");
            console.log("====================");
            console.log(optionalValue);
        }
    });
    return {
        copyright: function (year) {
            return new Handlebars.SafeString("&copy;" + year);
        },
        debug: function (options) {
            console.log(this, options);
        }
    };
};
