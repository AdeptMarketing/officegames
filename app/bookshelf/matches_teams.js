var Bookshelf = require('bookshelf').instance;

exports.Model = Bookshelf.Model.extend({

    tableName: 'matches_teams',

    hasTimestamps: true

});

