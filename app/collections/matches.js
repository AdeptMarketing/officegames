var Player = require('../models/match'),
    Base = require('./base');

module.exports = Base.extend({
    model: Player,
    url: '/matches'
});
module.exports.id = 'Matches';
