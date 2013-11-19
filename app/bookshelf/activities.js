var Bookshelf = require('bookshelf').instance;

exports.Model = Bookshelf.Model.extend({

    tableName: 'activities',

    hasTimestamps: true

});

