var Bookshelf = require('bookshelf').instance;

var Model = Bookshelf.Model.extend({

    tableName: 'players',

    hasTimestamps: true

});

exports.Model = Model;

exports.Collection = Bookshelf.Collection.extend({

    model: Model

});
