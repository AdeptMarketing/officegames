"use strict";
var path = require('path');

var stylesheetsDir = 'assets/stylesheets';
var rendrDir = 'node_modules/rendr';
var rendrHandlebarsDir = 'node_modules/rendr-handlebars';
var rendrModulesDir = rendrDir + '/node_modules';

module.exports = function (grunt) {
  // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        handlebars: {
            compile: {
                options: {
                    namespace: false,
                    commonjs: true,
                    processName: function (filename) {
                        return filename.replace('app/templates/', '').replace('.hbs', '');
                    }
                },
                src: "app/templates/**/*.hbs",
                dest: "app/templates/compiledTemplates.js",
                filter: function (filepath) {
                    var filename = path.basename(filepath);
                    // Exclude files that begin with '__' from being sent to the client,
                    // i.e. __layout.hbs.
                    return filename.slice(0, 2) !== '__';
                }
            }
        },

        jslint: {
            all: {
                src: [ 'app/**/*.js'],
                exclude: 'app/templates/compiledTemplates.js',
                options: { failOnError: false },
                directives: {
                    browser: true,
                    node: true,
                    nomen: true,
                    indent: 4
                }
            },
        },

        watch: {
            scripts: {
                files: 'app/**/*.js',
                tasks: ['rendr_stitch'],
                options: {
                    interrupt: true
                }
            },
            templates: {
                files: 'app/**/*.hbs',
                tasks: ['handlebars'],
                options: {
                    interrupt: true
                }
            }
        },

        rendr_stitch: {
            compile: {
                options: {
                    dependencies: [
                        'assets/vendor/**/*.js'
                    ],
                    npmDependencies: {
                        underscore: '../rendr/node_modules/underscore/underscore.js',
                        backbone: '../rendr/node_modules/backbone/backbone.js',
                        handlebars: '../rendr-handlebars/node_modules/handlebars/dist/handlebars.runtime.js',
                        async: '../rendr/node_modules/async/lib/async.js'
                    },
                    aliases: [
                        {from: rendrDir + '/client', to: 'rendr/client'},
                        {from: rendrDir + '/shared', to: 'rendr/shared'},
                        {from: rendrHandlebarsDir, to: 'rendr-handlebars'},
                        {from: rendrHandlebarsDir + '/shared', to: 'rendr-handlebars/shared'}
                    ]
                },
                files: [{
                    dest: 'public/mergedAssets.js',
                    src: [
                        'app/**/*.js',
                        rendrDir + '/client/**/*.js',
                        rendrDir + '/shared/**/*.js',
                        rendrHandlebarsDir + '/index.js',
                        rendrHandlebarsDir + '/shared/*.js'
                    ]
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-rendr-stitch');
    grunt.loadNpmTasks('grunt-jslint');

    grunt.registerTask('runNode', function () {
        grunt.util.spawn({
            cmd: 'node',
            args: ['./node_modules/nodemon/nodemon.js', 'index.js'],
            opts: {
                stdio: 'inherit'
            }
        }, function () {
            grunt.fail.fatal(new Error("nodemon quit"));
        });
    });


    grunt.registerTask('compile', ['jslint', 'handlebars', 'rendr_stitch']);

    // Run the server and watch for file changes
    grunt.registerTask('server', ['runNode', 'compile', 'watch']);

    // Default task(s).
    grunt.registerTask('default', ['compile']);
};
