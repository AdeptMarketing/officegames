var _ = require('underscore'),
    Activity = require('../models/activity'),
    MatchTeam = require('../models/match_team'),
    Team = require('../models/team'),
    Player = require('../models/player');

module.exports = {
    index: function (params, callback) {
        "use strict";

        if (this.app.req) {
            this.app.req.res.locals.nav = { dashboard: true };
        }

        var spec = {
            collection: {collection: 'matches', params: _.extend({
                querymod: [ ['limit', 5], ['orderBy', 'created_at', 'desc'] ],
                fetchmod: { withRelated: ['activity', 'teams.players'] }
            }, params)}
        },
            app = this.app;

        this.app.fetch(spec, function (err, result) {
            // cache nested models
            result.collection.each(function (match) {
                // a bit wasteful; would be better to create sets of unique models and save those;
                // here, we duplicate .store() operations

                new Activity(_.clone(match.get('activity')), {app: app}).store();

                _.each(
                    match.get('teams'),
                    function (team) {

                        new MatchTeam({
                            id: team._pivot_id,
                            match_id: team._pivot_match_id,
                            team_id: team._pivot_team_id,
                            winner: team._pivot_winner,
                            created_at: team._pivot_created_at,
                            modified_at: team._pivot_modified_at
                        }, {app: app}).store();

                        new Team(_.omit(team, [
                            '_pivot_id',
                            '_pivot_match_id',
                            '_pivot_team_id',
                            '_pivot_winner',
                            'players'
                        ]), {app: app}).store();

                        _.each(
                            team.players,
                            function (player) {
                                new Player(_.omit(player, [
                                    '_pivot_player_id',
                                    '_pivot_team_id'
                                ]), {app: app}).store();
                            }
                        );

                    }
                );
            });

            callback(err, result);

        });
    }
};
