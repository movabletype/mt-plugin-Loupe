/*global module:false*/
module.exports = function (grunt) {

  'use strict';

  require('matchdep').filterDev('grunt-*').forEach(function (name) {
    if (!/template/.test(name)) {
      grunt.loadNpmTasks(name);
    }
  });

  var requireConfig = (function () {
    var require = {
      config: function (obj) {
        require = function () {
          return obj;
        };
        return obj;
      }
    };
    return eval(grunt.file.read('./app/js/main.js').toString());
  }());

  var jasminPathsCoverage = grunt.util._.clone(requireConfig.paths);
  grunt.util._.forIn(jasminPathsCoverage, function (v, k) {
    jasminPathsCoverage[k] = '../../../app/' + v;
  });

  var hbsTemplates = grunt.util._.map(grunt.file.expand('app/js/**/*.hbs'), function (v) {
    return v.replace(/app\/(.*).hbs/, 'hbs!$1');
  });

  grunt.util._.forEach(grunt.file.expand('app/assets/**/*.hbs'), function (v) {
    hbsTemplates.push(v.replace(/app\/(.*).hbs/, 'hbs!$1'));
  });

  var widgetLibs = [];
  var widgetTemplates = [];

  grunt.util._.forEach(grunt.file.expand('app/widgets/**/*.*'), function (v) {
    if (!/\/spec\//.test(v)) {
      if (/\.hbs$/.test(v)) {
        widgetTemplates.push(v.replace(/app\/(.*).hbs/, 'hbs!$1'));
      } else if (/\.js$/.test(v)) {
        widgetLibs.push(v.replace(/app\/(.*).js/, '$1'));
      } else if (/\.(txt|text|tmpl|template|html|htm)/.test(v)) {
        widgetTemplates.push(v.replace(/app\/(.*)/, 'text!$1'));
      }
    }
  });

  var widgetLibsForJasmine = grunt.file.expand({
    filter: function (src) {
      return !(/\/spec\//).test(src);
    }
  }, 'app/widgets/**/*.js');

  var specs = [];
  var helpers = ['test/template.js', 'test/helper.js'];
  grunt.util._.forEach(grunt.file.expand('spec/**/*.js').concat(grunt.file.expand('app/widgets/*/spec/*.js')), function (src) {
    if (/_helper.js/.test(src)) {
      helpers.push(src);
    } else {
      specs.push(src);
    }
  });

  var testTarget = ['app/js/app.js', 'app/js/vent.js'].concat(grunt.file.expand('app/js/*/**/*.js')).concat(widgetLibsForJasmine);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      options: grunt.file.readJSON('.jshintrc'),
      gruntfile: {
        options: {
          evil: true
        },
        files: {
          src: ['Gruntfile.js']
        }
      },
      scripts: {
        files: {
          src: ['app/js/app.js', 'app/js/main.js', 'app/js/*/**/*.js']
        }
      }
    },
    plato: {
      options: {
        jshint: grunt.file.readJSON('.jshintrc')
      },
      files: {
        dest: 'test/reports',
        src: testTarget
      }
    },
    compass: {
      dev: {
        options: {
          sassDir: 'app',
          cssDir: 'app/css',
          specify: ['app/sass/**.scss', 'app/widgets/*/**.scss']
        }
      }
    },
    concat: {
      dev: {
        src: ['app/css/*/**/*.css'],
        dest: 'app/css/style.css'
      }
    },
    cssmin: {
      build: {
        files: {
          'build/css/style.css': ['app/css/**/*.css']
        }
      }
    },
    clean: {
      beforeCompass: ['app/css/style.css'],
      build: ['build/*'],
      afterBuild: [
        'build/build.txt',
        'build/components',
        'build/css/*',
        'build/index.html',
        'build/jade',
        'build/js/boot.js',
        'build/js/router',
        'build/js/main.js',
        'build/js/lib',
        'build/js/layouts',
        'build/js/require.js',
        'build/js/template',
        'build/js/vent.js',
        'build/js/views',
        'build/lib',
        'build/sass',
        'build/template',
        'build/templates',
        'build/widgets'
      ],
      afterTest: ['template.js']
    },
    copy: {
      prep: {
        files: [
        {
          expand: true,
          src: ['app/components/morris.js/morris.css', 'app/lib/mtchart/mtchart.css'],
          dest: 'app/css/lib/',
          flatten: true
        }
        ]
      },
      build: {
        files: [
        {
          expand: true,
          cwd: 'app/',
          src: ['widgets/**/assets/**'],
          dest: 'build',
          filter: 'isFile'
        }
        ]
      },
      beforeConcat: {
        files: [
        {
          expand: true,
          cwd: 'app/',
          src: ['widgets/**/*.css'],
          dest: 'app/css',
          filter: 'isFile'
        }
        ]
      }
    },
    symlink: {
      prep: {
        target: 'js/template',
        link: 'app/template',
        options: {
          overwrite: true
        }
      }
    },
    imagemin: {
      build: {
        files: [{
          expand: true,
          cwd: 'app/images',
          src: '*.{png,jpg,jpeg}',
          dest: 'build/images'
        }]
      }
    },
    watch: {
      index: {
        files: 'app/jade/*.jade',
        tasks: ['jade']
      },
      css: {
        files: [
          'app/sass/*.scss',
          'app/widgets/*/**.scss'
        ],
        tasks: ['clean:beforeCompass', 'compass', 'copy:beforeConcat', 'concat', 'cssmin']
      }
    },
    connect: {
      server: {
        options: {
          hostname: '172.17.0.1',
          port: 9001,
          keepalive: true
        }
      },
      test: {
        options: {
          hostname: 'localhost',
          port: 9002,
          keepalive: true
        }
      }
    },
    jasmine: {
      test: {
        src: testTarget,
        options: {
          specs: specs,
          helpers: helpers,
          host: 'http://localhost:9002/',
          outfile: '_SpecRunner.html',
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
            requireConfig: {
              baseUrl: './app/',
              paths: requireConfig.paths,
              shim: requireConfig.shim,
              deps: requireConfig.deps,
              locale: requireConfig.locale,
              hbs: requireConfig.hbs
            }
          }
        }
      },
      coverage: {
        src: testTarget,
        options: {
          specs: specs,
          helpers: helpers,
          template: require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            coverage: 'test/coverage/coverage.json',
            report: 'test/coverage',
            template: require('grunt-template-jasmine-requirejs'),
            templateOptions: {
              requireConfig: {
                baseUrl: '.grunt/grunt-contrib-jasmine/app/',
                paths: jasminPathsCoverage,
                shim: requireConfig.shim,
                deps: requireConfig.deps,
                locale: requireConfig.locale,
                hbs: requireConfig.hbs
              }
            }
          }
        }
      }
    },
    open: {
      dev: {
        path: 'http://localhost:9001/app/index.html'
      },
      build: {
        path: 'http://localhost:9001/build/index.html'
      },
      test: {
        path: 'http://localhost:9002/test/coverage/index.html'
      }
    },
    'sass-convert': {
      files: {
        src: ['app/sass/*.scss', 'app/widgets/**/*.scss']
      }
    },
    htmlmin: {
      build: {
        options: {
          removeComments: true,
          removeCommentsFromCDATA: true,
          removeCDATASectionsFromCDATA: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true
        },
        files: {
          'build/index.html': 'build/index.html'
        }
      }
    },
    'string-replace': {
      build: {
        options: {
          replacements: [
          {
            pattern: /([,;])define\(/g,
            replacement: '$1\ndefine('
          },
          {
            pattern: /define\("[\-\.\w]*",function\(\)\{\}\);[\n]?/g,
            replacement: ''
          },
          {
            pattern: /;(require\(\["app"\])/,
            replacement: ';\n$1'
          }
          ]
        },
        files: {
          'build/js/app.js': 'build/js/app.js',
          'build/js/template.js': 'build/js/template.js',
          'build/js/vendor.js': 'build/js/vendor.js',
          'build/js/widget.js': 'build/js/widget.js'
        }
      }
    },
    codestyle: {
      dev: {
        files: {
          'app/js/app.js': 'app/js/app.js'
        }
      }
    },
    jade: {
      dev: {
        options: {
          pretty: true,
          data: {
            dev: true
          }
        },
        files: {
          "app/index.html": "app/jade/index.jade"
        }
      },
      build: {
        options: {
          pretty: true,
          data: {
            dev: false
          }
        },
        files: {
          "build/index.html": "app/jade/index.jade"
        }
      }
    },
    requirejs: {
      test: {
        options: {
          baseUrl: "app",
          mainConfigFile: 'app/js/main.js',
          name: 'js/template',
          out: 'test/template.js',
          include: ['lib/require', 'json!widgets/stats/settings.json', 'json!widgets/widgets.json'].concat(hbsTemplates).concat(widgetTemplates),
          exclude: ['jquery', 'handlebars', 'hbs'],
          optimize: 'none',
          optimizeCss: 'none'
        }
      },
      build: {
        options: {
          appDir: "app",
          baseUrl: ".",
          mainConfigFile: 'app/js/main.js',
          paths: {
            "requireLib": "lib/require",
            "text": "components/requirejs-text/text",
            "json": "components/requirejs-plugins/src/json",
            "modernizr": "lib/modernizr/modernizr",
            "underscore": "components/underscore/underscore-min",
            "backbone": "components/backbone/backbone-min",
            "backbone.localStorage": "components/backbone.localStorage/backbone.localStorage-min",
            "jquery": "components/jquery/jquery.min",
            "jquery.hammer": "components/hammerjs/dist/jquery.hammer.min",
            "jquery-smartresize": "components/jquery-smartresize/jquery.debouncedresize",
            "backbone.wreqr": "components/backbone.wreqr/lib/amd/backbone.wreqr.min",
            "backbone.babysitter": "components/backbone.babysitter/lib/amd/backbone.babysitter.min",
            "backbone.marionette": "components/backbone.marionette/lib/core/amd/backbone.marionette.min",
            "backbone.marionette.handlebars": "components/backbone.marionette.handlebars/backbone.marionette.handlebars",
            "hbs": "components/require-handlebars-plugin/hbs",
            "handlebars": "components/require-handlebars-plugin/Handlebars",
            "i18nprecompile": "components/require-handlebars-plugin/hbs/i18nprecompile",
            "json2": "components/require-handlebars-plugin/hbs/json2",
            "eve": "lib/raphael/eve",
            "raphael": "lib/raphael/raphael",
            "morris": "components/morris.js/morris.min",
            "mtchart": "lib/mtchart/mtchart",
            "main": "js/main",
            "boot": "js/boot",
            "app": "js/app",
            "vendor": "js/vendor",
            "template": "js/template",
            "widget": "js/widget",
            "easeljs": "components/EaselJS/lib/easeljs-0.6.0.min"
          },
          dir: "build",
          modules: [
            {
            name: 'vendor',
            include: [
                "jquery",
                "modernizr",
                "requireLib",
                "text",
                "json",
                "underscore",
                "backbone",
                "backbone.localStorage",
                "backbone.wreqr",
                "backbone.babysitter",
                "backbone.marionette",
                "backbone.marionette.handlebars",
                "hbs",
                "handlebars",
                "i18nprecompile",
                "json2",
                "eve",
                "raphael",
                "morris",
                "jquery.hammer",
                "jquery-smartresize",
                "easeljs"
              ]
          },
            {
            name: 'template',
            include: hbsTemplates,
            exclude: ['vendor']
          },
          {
            name: 'widget',
            include: widgetLibs.concat(widgetTemplates),
            exclude: ['vendor', 'template']
          },
          {
            name: 'app',
            include: ['boot'],
            exclude: ['vendor', 'template', 'widget']
          }
          ],

          skipDirOptimize: true,
          removeCombined: false,
          optimize: "uglify2",
          optimizeCss: "none",

          uglify2: {
            output: {
              beautify: false,
              max_line_len: 1000000
            },
            compress: {
              sequences: false,
              global_defs: {
                DEBUG: false
              },
              unsafe: true
            },
            warnings: true,
            mangle: true,
            unsafe: true
          },

          stubModules: [],

          fileExclusionRegExp: /^\./,

          preserveLicenseComments: true,

          pragmasOnSave: {
            //removes Handlebars.Parser code (used to compile template strings) set
            //it to `false` if you need to parse template strings even after build
            excludeHbsParser: true,
            // kills the entire plugin set once it's built.
            excludeHbs: true,
            // removes i18n precompiler, handlebars and json2
            excludeAfterBuild: true
          },

          locale: "ja_jp",
          // default plugin settings, listing here just as a reference
          hbs: {
            templateExtension: 'hbs',
            // if disableI18n is `true` it won't load locales and the i18n helper
            // won't work as well.
            disableI18n: false
          }
        }
      }
    }
  });

  grunt.registerTask('build', [
    'symlink:prep',
    'copy:prep',
    'clean:build',
    'imagemin',
    'clean:beforeCompass',
    'compass',
    'requirejs:build',
    'clean:afterBuild',
    'string-replace',
    'copy:beforeConcat',
    'cssmin:build',
    'copy:build',
    'jade:build',
    'htmlmin'
  ]);

  grunt.registerTask('dev', [
    'symlink:prep',
    'copy:prep',
    'jade:dev',
    'sass-convert',
    'compass:dev',
    'copy:beforeConcat',
    'concat:dev'
  ]);

  grunt.registerTask('test', [
    'requirejs:test',
    'jshint',
    'jasmine',
    'clean:afterTest',
    'open:test'
  ]);

  grunt.registerTask('none', []);
};
