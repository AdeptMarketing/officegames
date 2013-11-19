"use strict";

var Bookshelf = require('bookshelf').instance,
    Teams = require('./teams'),
    MatchesTeams = require('./matches_teams'),
    Activity = require('./activities');

var Model = Bookshelf.Model.extend({

    tableName: 'matches',

    hasTimestamps: true,

    teams: function () {
        return this.belongsToMany(Teams.Model).through(MatchesTeams.Model).withPivot(['winner']);
    },

    activity: function () {
        return this.belongsTo(Activity.Model);
    }

});
exports.Model = Model;

exports.Collection = Bookshelf.Collection.extend({

    model: Model

});
