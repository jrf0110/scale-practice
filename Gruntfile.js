var fs = require('fs');
var async = require('async');
var childProcess = require('child_process');

module.exports = function( grunt ){
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-browserify');

  var pkg = require('./package.json');

  var config = {
    pkg: pkg

  , watch: {
      jshint: {
        // Concat jshint.all
        files: [],
        tasks: ['jshint'],
        options: { spawn: false }
      }

    , less: {
        files: [ 'less/*.less', 'less/**/*.less' ]
      , tasks: ['less']
      , options: { spawn: false }
      }
    }

  , less: {
      dev: {
        files: {
          "css/core.gen.css":          "less/core.less"
        }
      }
    }

  , jshint: {
      // define the files to lint
      all: ['*.js', 'js/*.js', 'js/**/*.js'],
      options: {
        ignores: ['node_modules', 'jam/**', 'bower_components/**'],
        laxcomma: true,
        sub: true,
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    }

  , connect: {
      server: {
        options: {
          port: 8081
        }
      }
    }
  };

  config.watch.jshint.files = config.watch.jshint.files.concat(
    config.jshint.all
  );

  // config.watch.browserify.files = config.watch.jshint.files;

  grunt.initConfig( config );

  grunt.registerTask( 'default', [
    'jshint'
  // , 'browserify'
  , 'less'
  , 'connect'
  , 'watch'
  ]);

  grunt.registerTask( 'build', [
    'jshint'
  // , 'browserify'
  , 'less'
  ]);
};
