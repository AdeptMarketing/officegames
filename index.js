var express = require('express'),
    rendr = require('rendr'),
    _ = require('underscore'),
    config = require('config'),
    path = require('path'),
    bookshelfAdapter = new (require('./app/lib/bookshelf_adapter'))(config.db['default']),
    lessmw = require('less-middleware')({
        src: path.join(__dirname, 'less'),
        dest: path.join(__dirname, 'public', 'stylesheets'),
        prefix: '/stylesheets'
    }),
    app = express();

/**
 * Initialize Express middleware stack.
 */
app.use(express.compress());
app.use(lessmw);
app.use(express.static(__dirname + '/public'));
app.use(express.logger());
app.use(express.bodyParser());


/**
 * Initialize our Rendr server.
 */
var server = rendr.createServer({
    dataAdapter: bookshelfAdapter,
    appData: config.appData
});

/**
  * To mount Rendr, which owns its own Express instance for better encapsulation,
  * simply add `server` as a middleware onto your Express app.
  * This will add all of the routes defined in your `app/routes.js`.
  * If you want to mount your Rendr app onto a path, you can do something like:
  *
  *     app.use('/my_cool_app', server);
  */
app.use(server);

/**
 * Start the Express server.
 */
function start() {
    var port = process.env.PORT || config.server.port;
    app.listen(port);
    console.log("server pid %s listening on port %s in %s mode",
        process.pid,
        port,
        app.get('env'));
}


/**
 * Only start server if this script is executed, not if it's require()'d.
 * This makes it easier to run integration tests on ephemeral ports.
 */
if (require.main === module) {
    // setup tables
    bookshelfAdapter.setupTables().then(function () {
        start();
    }, function () {
        console.error('There was an error setting up the database. Not starting server.');
    });
}

exports.app = app;
