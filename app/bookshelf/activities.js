var Bookshelf = require('bookshelf').instance;

var Model = Bookshelf.Model.extend({

    tableName: 'activities',

    hasTimestamps: true

});

exports.Model = Model;

exports.Collection = Bookshelf.Collection.extend({

    model: Model

});
