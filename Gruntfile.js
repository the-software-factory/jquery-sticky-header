var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var fs = require('fs');

module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'test/*.js', 'test/src/**/*.js']
        },
        uglify: {
            minification: {
                files: {
                    'dist/jquery.sticky-header.min.js': 'src/jquery.sticky-header.js'
                }
            }
        },
        cssmin: {
            style: {
                options: {
                    shorthandCompacting: false,
                    requireoundingPrecision: -1,
                    keepSpecialComments: 0
                },
            files: { 'dist/jquery.sticky-header.min.css': 'src/jquery.sticky-header.css' }
          }
        },
        usebanner: {
            banner: {
                options: {
                    position: 'top',
                    linebreak: true,
                    process: function() {
                        var latestTag = execSync("git describe --tags").toString().split('-')[0];
                        var firstYear = "2015";
                        var lastYear = execSync("git log --format='%ai' | head -n 1").toString().split('-')[0];

                        return "/*\n" +
                            " * jQuery Sticky Header v" + latestTag + " (https://github.com/the-software-factory/jquery-sticky-header)\n" +
                            " * Copyright (c) " + ((firstYear === lastYear) ? firstYear : (firstYear + "-" + lastYear)) + " Vendini srl <vendini@pec.it>\n" +
                            " * Licensed under MIT (https://github.com/the-software-factory/jquery-sticky-header/blob/master/LICENSE.md)\n" +
                            " */";
                    }
                },
                files: {
                    src: ['dist/jquery.sticky-header.min.js', 'dist/jquery.sticky-header.min.css']
                }
            }
        },
        devserver: {
            options: {
                type: 'http',
                port: '9000',
                base: './',
                async: false
            },
            server: {}
        },
        watch: {
            scripts: {
                files:  ['Gruntfile.js', 'src/**/*.js', 'test/*.js', 'test/src/**/*.js'],
                tasks: ['default']
            }
        },
        conventionalChangelog: {
            options: {
                changelogOpts: {
                    preset: 'jshint',
                    releaseCount: 0
                }
            },
            release: {
                src: 'CHANGELOG.md'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-devserver');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-conventional-changelog');

    grunt.registerTask("emptyTheChangelog", function() {
        fs.truncateSync(grunt.config.get("conventionalChangelog.release.src"), 0);
    });

    grunt.registerTask("changelogCommit", function() {
        var done = this.async();

        var gitAdder = exec('git add CHANGELOG.md');

        gitAdder.on("exit", function(exitCode) {
            if (exitCode !== 0) {
                grunt.fail.fatal("changelogCommit task couldn't exec git add command");
            }

            var gitCommitter = exec('git commit -m "CHANGELOG.md Updated"');

            gitCommitter.on("exit", function(exitCode) {
                if (exitCode !== 0) {
                    grunt.fail.fatal("changelogCommit task couldn't exec git commit command");
                }

                grunt.log.ok("Changelog commit is ready");
                done();
            });
        });
    });

    grunt.registerTask("default", ["jshint", "uglify", "cssmin", "usebanner"]);
    grunt.registerTask("development", ["devserver", "watch"]);
    grunt.registerTask("changelog", ["emptyTheChangelog", "conventionalChangelog", "changelogCommit"]);
};
