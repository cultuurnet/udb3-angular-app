// Generated on 2014-10-09 using generator-angular 0.9.8
'use strict';

var modRewrite = require('connect-modrewrite');
var xml2js = require('xml2js');
var jsonminify = require('jsonminify');
const webpackConfig = require('./webpack.config');

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./package.json').appPath || 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: [
          '<%= yeoman.app %>/styles/{,*/}*.less',
          'bower_components/udb3-angular/src/styles/{,*/}*.less'
        ],
        tasks: ['less', 'newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['browserify']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/css/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      },
      peg: {
        files: ['<%= yeoman.app %>/grammar/{,*/}*.grammar'],
        tasks: ['peg']
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9999,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              modRewrite(['!\\.html|\\.js|\\.svg|\\.css|\\.png|\\.eot|\\.woff|\\.ttf|\\.swf|\\.otf|\\.md$ /index.html [L]']),
              connect.static('.tmp'),
              connect().use(
                '/node_modules',
                connect.static('./node_modules')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/node_modules',
                connect.static('./node_modules')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
        ignores: ['<%= yeoman.app %>/scripts/parsers/{,*/}*.js']
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    less: {
      app: {
        options: {
          paths: [
            'node_modules/bootstrap/less',
            'node_modules/components-font-awesome/less',
            'node_modules/udb3-angular/src/styles'
          ],
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: 'app.css.map',
          sourceMapFilename: '<%= yeoman.app %>/css/app.css.map'
        },
        files: {
          '<%= yeoman.app %>/css/app.css': '<%= yeoman.app %>/styles/app.less'
        }
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/css/',
          src: '{,*/}*.css',
          dest: '.tmp/css/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        exclude: [
          'bower_components/bootstrap/dist/css/bootstrap.css',
          'bower_components/components-font-awesome/css/font-awesome.css',
          'bower_components/udb3-angular/dist/udb3-angular.css'
        ],
        ignorePath:  /\.\.\//,
        options: {
          'overrides': {
            'socket.io-client': {
              'main': 'socket.io.js'
            },
            'angular-i18n': {
              'main': 'angular-locale_nl-be.js'
            },
            'moment': {
              'main': [
                'moment.js',
                'locale/nl.js'
              ]
            },
            'bootstrap-datepicker': {
              'main': [
                'js/bootstrap-datepicker.js',
                'js/locales/bootstrap-datepicker.nl-BE.js',
                'dist/css/bootstrap-datepicker.css'
              ]
            }
          }
        }
      }
    },

    browserify: {
      vendor: {
        src: [],
        dest: 'app/scripts/vendor.js',
        options: {
          require: [
            'es5-shim', 'angular', 'json3', 'bootstrap', 'angular-resource',
            'angular-cookies', 'angular-sanitize', 'angular-touch',
            'angular-markdown-directive', '@uirouter/angularjs', 'angular-zendesk-widget',
            'ng-meta', 'angular-deferred-bootstrap', 'angular-translate-once',
            'angular-translate-storage-cookie', 'angular-dynamic-locale',
            'udb3-angular'
          ],
        }
      },
//      client: {
//        src: ['client/**/*.js'],
//        dest: 'public/app.js',
//        options: {
//          external: ['jquery', 'momentWrapper'],
//        }
//      }
    },

    webpack: {
      prod: webpackConfig,
      dev: Object.assign({ watch: true }, webpackConfig)
    },

    'webpack-dev-server': {
      options: {
        contentBase: 'app',
        port: 9999,
        keepAlive: true
      },
      frontend: {
        webpack: {
          devtool: 'cheap-eval-sourcemap'
        }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/css/{,*/}*.css',
          '<%= yeoman.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/css/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>','<%= yeoman.dist %>/images']
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/css/app.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      src: {
        files: [{
          expand: true,
          cwd: 'app/scripts',
          src: ['{,*/}*.js'],
          dest: 'app/scripts'
        }],
        singleQuotes: true
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'fonts/*',
            'docs/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'node_modules/udb3-angular/images/icons',
          dest: '<%= yeoman.dist %>/images/icons',
          src: ['*']
        }, {
          expand: true,
          cwd: 'node_modules/udb3-angular/images/form-calendar',
          dest: '<%= yeoman.dist %>/images/form-calendar',
          src: ['*']
        }, {
          expand: true,
          cwd: 'node_modules/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>'
        }, {
          expand: true,
          cwd: 'node_modules/components-font-awesome',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>'
        },{
          expand: true,
          cwd: '<%= yeoman.app %>/css',
          dest: '.tmp/css/',
          src: '{,*/}*.css'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/css',
        dest: '.tmp/css/',
        src: '{,*/}*.css'
      },
      fonts: {
        expand: true,
        cwd: 'node_modules/components-font-awesome/fonts',
        dest: '<%= yeoman.app %>/fonts',
        src: '*'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles',
        'copy:fonts'
      ],
      test: [
        'copy:styles',
        'copy:fonts'
      ],
      dist: [
        'copy:fonts',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },

    ngconstant: {
      options: {
        name: 'config',
        dest: '<%= yeoman.app %>/scripts/config.js'
      },
      dev: {
        constants: function() {
          return {
            appConfig: JSON.parse(JSON.minify(grunt.file.read('config.json')))
          };
        }
      },
      dist: {
        constants: function() {
          var config = {};

          if (grunt.file.exists('config.json')) {
            config = JSON.parse(JSON.minify(grunt.file.read('config.json')));
          } else {
            config = JSON.parse(JSON.minify(grunt.file.read('config.json.dist')));
          }

          return {
            appConfig: config
          };
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-ng-constant');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      //'wiredep',
      //'browserify',
      'concurrent:server',
      'ngconstant:dev',
      'less',
      'autoprefixer',
      //'connect:livereload',
      'webpack:dev',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'ngconstant:dev',
    'less',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    //'wiredep',
    //'browserify',
    'webpack',
    'useminPrepare',
    'concurrent:dist',
    'ngconstant:dist',
    'less',
    'autoprefixer',
    'concat',
    'ngAnnotate:src',
    'copy:dist',
    //'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
