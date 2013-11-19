"use strict";

var Bookshelf = require('bookshelf'),
    _ = require('underscore'),
    when = require('when'),
    path = require('path'),
    util = require('util'),
    config = require('config'),
    DataAdapter = (require('rendr/server/data_adapter'));

var BookshelfAdapter = function (conf) {
    if (!Bookshelf.instance) {
        //Bookshelf.instance = Bookshelf.initialize(_.extend({debug: true}, conf));
        Bookshelf.instance = Bookshelf.initialize(conf);
    }

    this.instance = Bookshelf.instance;
};

util.inherits(BookshelfAdapter, DataAdapter);

BookshelfAdapter.prototype.setupTables = function () {
    var self = this;
    return when.all([

        self.instance.knex.schema.hasTable('players').then(function (exists) {
            if (!exists) {
                return self.instance.knex.schema.createTable('players', function (table) {
                    console.log('Creating players table');
                    table.increments().primary();
                    table.string('name').unique();
                    table.string('email').unique();
                    table.timestamps();
                });
            }
        }),

        self.instance.knex.schema.hasTable('teams').then(function (exists) {
            if (!exists) {
                return self.instance.knex.schema.createTable('teams', function (table) {
                    console.log('Creating teams table');
                    table.increments().primary();
                    table.string('name');
                    table.timestamps();
                });
            }
        }),

        self.instance.knex.schema.hasTable('players_teams').then(function (exists) {
            if (!exists) {
                return self.instance.knex.schema.createTable('players_teams', function (table) {
                    console.log('Creating players_teams table');
                    table.increments().primary();
                    table.integer('player_id').notNullable();
                    table.integer('team_id').notNullable();
                });
            }
        }),

        self.instance.knex.schema.hasTable('matches').then(function (exists) {
            if (!exists) {
                return self.instance.knex.schema.createTable('matches', function (table) {
                    console.log('Creating matches table');
                    table.increments().primary();
                    table.integer('activity_id');
                    table.timestamp('start_time');
                    table.timestamps();
                });
            }
        }),

        self.instance.knex.schema.hasTable('matches_teams').then(function (exists) {
            if (!exists) {
                return self.instance.knex.schema.createTable('matches_teams', function (table) {
                    console.log('Creating matches_teams table');
                    table.increments().primary();
                    table.integer('match_id').notNullable();
                    table.integer('team_id').notNullable();
                    table.boolean('winner').notNullable();
                });
            }
        }),

        self.instance.knex.schema.hasTable('activities').then(function (exists) {
            if (!exists) {
                return self.instance.knex.schema.createTable('activities', function (table) {
                    console.log('Creating activities table');
                    table.increments().primary();
                    table.string('name');
                    table.timestamps();
                });
            }
        })

    ]);

};

BookshelfAdapter.prototype.request = function (req, api, options, callback) {
    /*jslint unparam:true*/

    /**
    * Allow for either 3 or 4 arguments; `options` is optional.
    */
    if (arguments.length === 3) {
        callback = options;
        options = {};
    }

    if (api.method === 'GET') {
        var table = api.path.substr(1),
            BookshelfCollection = require('../bookshelf/' + table).Collection,
            bookshelfCollection = _.reduce(
                api.query.querymod,
                function (bcol, qm) {
                    return bcol.query.apply(bcol, qm);
                },
                new BookshelfCollection()
            );

        bookshelfCollection.fetch(api.query.fetchmod ? _.clone(api.query.fetchmod) : {}).then(function (collection) {
            //console.log(util.inspect(collection.toJSON(), {colors: true, depth: 6}));
            callback(null, {statusCode: 200}, collection.toJSON());
        }, function (err) {
            callback(err, {statusCode: 500}, "knex error");
        });
    }

};

module.exports = BookshelfAdapter;
