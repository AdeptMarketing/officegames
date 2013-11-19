"use strict";

var Bookshelf = require('bookshelf').instance,
    Players = require('./players');

exports.Model = Bookshelf.Model.extend({

    tableName: 'teams',

    hasTimestamps: true,

    players: function () {
        return this.belongsToMany(Players.Model);
    }

});
