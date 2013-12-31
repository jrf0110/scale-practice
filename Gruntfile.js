var fs = require('fs');
var async = require('async');
var wrench = require('wrench');
var jsdom = require('jsdom');
var childProcess = require('child_process');

module.exports = function( grunt ){
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  var config = {
    pkg: grunt.file.readJSON('package.json')

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

  , mkdir: {
      build: {
        dir: [
          './build', './build/js'
        ]
      }
    }

  , copy: {
      build: {
        files: [
          { expand: true, src: ['./css/*'], dest: './build' }
        , { expand: true, src: ['./img/*'], dest: './build' }
        , { expand: true, src: ['*.html'], dest: './build' }
        ]
      }
    }

  , rmscripts: {
      build: {
        src: [ 'build/*.html' ]
      }
    }

  , addscripts: {
      build: {
        scripts: [ '/js/bundle.js' ]
      , src: [ './build/*.html' ]
      }
    }

  , concat: {
      build: {
        // TODO: get this dynamically with jsdom
        src: [
          
        ]

      , dest: './build/js/bundle.js'
      }
    }

  , uglify: {
      options: { /*mangle: false*/ }
    , build: {
        files: {
          'build/js/bundle.js': [ 'build/js/bundle.js' ]
        }
      }
    }
  };

  config.watch.jshint.files = config.watch.jshint.files.concat(
    config.jshint.all
  );

  grunt.initConfig( config );

  grunt.registerTask( 'default', [
    'jshint'
  , 'less'
  , 'connect'
  , 'watch'
  ]);

  grunt.registerTask( 'build', [
    'jshint'
  , 'less'
  , 'mkdir:build'
  , 'copy:build'
  , 'concat:build'
  , 'uglify:build'
  , 'rmscripts:build'
  , 'addscripts:build'
  ]);

  grunt.registerMultiTask( 'mkdir', function(){
    this.data.dir.forEach( function( dir ){
      // Remove if it currently exists
      if ( fs.existsSync( dir ) ) wrench.rmdirSyncRecursive( dir );

      fs.mkdirSync( dir );
    });
  });

  grunt.registerMultiTask( 'rmscripts', function(){
    var done = this.async();
    var replacement = this.data.replaceWith || '';

    async.series(
      grunt.file.expand( this.data.src ).map( function( file ){
        return function( next ){
          jsdom.env( file, ["http://code.jquery.com/jquery.js"], function( errors, window ){
            var doc = window.document;
            var $ = window.$;
            var $scripts = $('script').filter( function( s ){
              return !!$(this).attr('src');
            });
            $scripts.last().after( doc.createTextNode( replacement ) );
            $scripts.remove();

            fs.writeFileSync( file, [
              '<!DOCTYPE HTML>'
            , '<html>'
            , '  <head>'
            , doc.head.innerHTML
            , '  </head>'
            , '  <body class="' + doc.body.className + '">'
            , doc.body.innerHTML
            , '  </body>'
            , '</html>'
            ].join('\n'));

            next();
          });
        };
      })
    , function( error ){ done( !error ); }
    );
  });

  grunt.registerMultiTask( 'addscripts', function(){
    var done = this.async();
    var paths = this.data.scripts;
    var tmpl = '<script type="text/javascript" src="{{path}}"></script>';

    async.series(
      grunt.file.expand( this.data.src ).map( function( file ){
        return function( next ){
          jsdom.env( file, ["http://code.jquery.com/jquery.js"], function( errors, window ){
            var doc = window.document;
            var $ = window.$;
            var $scripts = $();

            paths.reverse().forEach( function( p ){
              $scripts = $scripts.add(
                $( tmpl.replace( '{{path}}', p ) )
              );
            });

            $('script').eq(0).before( $scripts );

            fs.writeFileSync( file, [
              '<!DOCTYPE HTML>'
            , '<html>'
            , '  <head>'
            , doc.head.innerHTML
            , '  </head>'
            , '  <body class="' + doc.body.className + '">'
            , doc.body.innerHTML
            , '  </body>'
            , '</html>'
            ].join('\n'));

            next();
          });
        };
      })
    , function( error ){ done( !error ); }
    );
  });
};
