/*global module:false*/
module.exports = function (grunt) {

  'use strict';

  require('matchdep').filterDev('grunt-*').forEach(function (name) {
    if (!/template/.test(name)) {
      grunt.loadNpmTasks(name);
    }
  });

  grunt.loadTasks('grunt_local_tasks');

  var requireConfig = grunt.file.readJSON('./app/js/require.config.json');

  var requireJSPaths = {
    "requireLib": "lib/require",
    "underscore": "lib/underscore/underscore-min",
    "backbone": "lib/backbone/backbone-min",
    "backbone.localStorage": "lib/backbone.localStorage/backbone.localStorage-min",
    "jquery": "lib/jquery/jquery-1.10.1.min",
    "jquery.hammer": "lib/hammerjs/dist/jquery.hammer.min",
    "backbone.wreqr": "lib/backbone.wreqr/lib/amd/backbone.wreqr.min",
    "backbone.babysitter": "lib/backbone.babysitter/lib/amd/backbone.babysitter.min",
    "backbone.marionette": "lib/backbone.marionette/lib/core/amd/backbone.marionette.min",
    "moment": "lib/moment/min/moment.min",
    "moment.lang": "lib/moment/min/langs",
    "morris": "lib/morris.js/morris.min",
    "mtchart": "lib/chart-api/core/amd/mtchart.core.amd.min",
    "main": "js/main",
    "boot": "js/boot",
    "app": "js/app",
    "vendor": "js/vendor",
    "template": "js/template",
    "card": "js/card"
  };

  var jasminPathsCoverage = grunt.util._.clone(requireConfig.paths);
  grunt.util._.forIn(jasminPathsCoverage, function (v, k) {
    jasminPathsCoverage[k] = '../../../app/' + v;
  });

  var hbsTemplates = [];
  grunt.util._.forEach(grunt.file.expand('app/js/template/helpers/*.js'), function (v) {
    hbsTemplates.push(v.replace(/app\/(.*).js/, '$1'));
  });

  grunt.util._.forEach(grunt.file.expand('app/js/**/*.hbs'), function (v) {
    hbsTemplates.push(v.replace(/app\/(.*).hbs/, 'hbs!$1'));
  });

  grunt.util._.forEach(grunt.file.expand('app/assets/**/*.hbs'), function (v) {
    hbsTemplates.push(v.replace(/app\/(.*).hbs/, 'hbs!$1'));
  });

  var cardLibs = [];
  var cardTemplates = [];

  grunt.util._.forEach(grunt.file.expand('app/cards/**/*.*'), function (v) {
    if (!/\/spec\//.test(v)) {
      if (/\.hbs$/.test(v)) {
        cardTemplates.push(v.replace(/app\/(.*).hbs/, 'hbs!$1'));
      } else if (/\.js$/.test(v)) {
        if (!/templates\/helpers/.test(v)) {
          cardLibs.push(v.replace(/app\/(.*).js/, '$1'));
        }
      } else if (/\.(txt|text|tmpl|template|html|htm)/.test(v)) {
        cardTemplates.push(v.replace(/app\/(.*)/, 'text!$1'));
      }
    }
  });

  var langs = ['de', 'es', 'fr', 'ja', 'nl', 'en-us'];
  var langTemplates = {};
  grunt.util._.forEach(langs, function (lang) {
    langTemplates[lang] = grunt.util._.map(grunt.file.expand({
      cwd: 'app'
    }, '**/' + lang + '.json'), function (src) {
      return 'json!' + src;
    });
  });

  var cardLibsForJasmine = grunt.file.expand({
    filter: function (src) {
      return !(/\/spec\//).test(src);
    }
  }, 'app/cards/**/*.js');

  var specs = [];
  var helpers = ['app/lib/jquery/jquery-1.10.1.js', 'test/template.js', 'test/jasmine.helper.js'];
  grunt.util._.forEach(grunt.file.expand('spec/**/*.js').concat(grunt.file.expand('app/cards/*/spec/**/*.js')), function (src) {
    if (/_helper.js/.test(src)) {
      helpers.push(src);
    } else {
      specs.push(src);
    }
  });

  var testTarget = ['app/js/app.js', 'app/js/vent.js', 'app/js/mtapi.js', 'app/js/device.js', 'app/js/cache.js', 'app/js/commands.js', 'app/js/trans.js', 'app/js/l10n.js', 'app/js/boot.js'].concat(grunt.file.expand('app/js/*/**/*.js')).concat(cardLibsForJasmine);
  testTarget = grunt.util._.without(testTarget, 'app/js/mtapi/mock.js');

  var settings = grunt.file.readJSON('settings.json');

  var bulkSymlinkLinks = grunt.file.expand('app/cards/*/templates/helpers/*.js').map(function (filename) {
    return '../../../' + filename.replace('app/', '');
  });

  var jsHintFiles = ['app/js/app.js', 'app/js/vent.js', 'app/js/mtapi.js', 'app/js/device.js', 'app/js/cache.js', 'app/js/commands.js', 'app/js/trans.js', 'app/js/l10n.js', 'app/js/boot.js'];
  grunt.util._.forEach(grunt.file.expand('app/js/*/**/*.js'), function (src) {
    if (!/mock.js/.test(src) && src !== 'app/js/l10n/ja.js') {
      jsHintFiles.push(src);
    }
  });

  var csses = grunt.file.expand({
    cwd: 'app'
  }, 'css/*/**/*.css').concat(grunt.file.expand({
    cwd: 'app'
  }, 'cards/css/**/*.css'));
  csses = grunt.util._.reject(csses, function (css) {
    return (/assets\//).test(css);
  });

  // Project configuration.
  grunt.initConfig({
    jshint: {
      options: grunt.file.readJSON('.jshintrc'),
      gruntfile: {
        options: {
          es5: false,
          unused: false,
          evil: true
        },
        files: {
          src: ['Gruntfile.js']
        }
      },
      scripts: {
        files: {
          src: jsHintFiles
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
          specify: ['app/sass/*.scss', 'app/sass/*.sass', 'app/cards/*/*.scss', 'app/cards/*/*.sass', 'app/cards/*/sass/*.scss', 'app/cards/*/sass/*.sass']
        }
      }
    },
    concat: {
      dev: {
        src: ['app/css/*/**/*.css', 'app/cards/css/**/*.css'],
        dest: 'app/css/style.css'
      }
    },
    cssmin: {
      build: {
        files: {
          '../mt-static/plugins/Loupe/css/style.css': ['app/css/*/**/*.css']
        }
      }
    },
    clean: {
      beforeCompass: ['app/css/style.css', 'app/css/assets', 'app/css/**/assets'],
      build: {
        options: {
          force: true
        },
        src: ['../mt-static/plugins/Loupe/*']
      },
      afterBuild: {
        options: {
          force: true
        },
        src: [
          '../mt-static/plugins/Loupe/build.txt',
          '../mt-static/plugins/Loupe/css/*',
          '../mt-static/plugins/Loupe/index.html',
          '../mt-static/plugins/Loupe/jade',
          '../mt-static/plugins/Loupe/js/boot.js',
          '../mt-static/plugins/Loupe/js/cache.js',
          '../mt-static/plugins/Loupe/js/collections',
          '../mt-static/plugins/Loupe/js/device.js',
          '../mt-static/plugins/Loupe/js/models',
          '../mt-static/plugins/Loupe/js/commands.js',
          '../mt-static/plugins/Loupe/js/mtapi',
          '../mt-static/plugins/Loupe/js/mtapi.js',
          '../mt-static/plugins/Loupe/js/perf.js',
          '../mt-static/plugins/Loupe/js/router',
          '../mt-static/plugins/Loupe/js/main.js',
          '../mt-static/plugins/Loupe/js/main.preprocess.js',
          '../mt-static/plugins/Loupe/js/require.config.json',
          '../mt-static/plugins/Loupe/js/l10n.js',
          '../mt-static/plugins/Loupe/js/lib',
          '../mt-static/plugins/Loupe/js/layouts',
          '../mt-static/plugins/Loupe/js/require.js',
          '../mt-static/plugins/Loupe/js/template',
          '../mt-static/plugins/Loupe/js/trans.js',
          '../mt-static/plugins/Loupe/js/vent.js',
          '../mt-static/plugins/Loupe/js/views',
          '../mt-static/plugins/Loupe/l10n',
          '../mt-static/plugins/Loupe/lib',
          '../mt-static/plugins/Loupe/preprocesses',
          '../mt-static/plugins/Loupe/sass',
          '../mt-static/plugins/Loupe/template',
          '../mt-static/plugins/Loupe/templates',
          '../mt-static/plugins/Loupe/cards',
          '../mt-static/plugins/Loupe/assets/icons/index.html',
          '../mt-static/plugins/Loupe/assets/icons/license.txt',
          '../mt-static/plugins/Loupe/assets/icons/Read Me.txt',
          '../mt-static/plugins/Loupe/assets/icons/MTIcon.json',
          '../mt-static/plugins/Loupe/assets/icons/svg'
        ]
      },
      afterTest: ['template.js'],
      beforeCoverage: ['.grunt/grunt-contrib-jasmine', 'app/test/coverage']
    },
    copy: {
      prep: {
        files: [{
          expand: true,
          src: ['app/lib/chart-api/mtchart.css'],
          dest: 'app/css/lib/',
          flatten: true
        }]
      },
      build: {
        files: [{
          expand: true,
          cwd: 'app/',
          src: ['cards/**/assets/**'],
          dest: '../mt-static/plugins/Loupe',
          filter: 'isFile'
        }]
      },
      beforeConcat: {
        files: [{
          expand: true,
          cwd: 'app/',
          src: ['cards/**/*.css'],
          dest: 'app/css',
          filter: 'isFile'
        }]
      }
    },
    symlink: {
      options: {
        overwrite: true
      },
      prep: {
        target: 'js/template',
        link: 'app/template'
      },
      prep2: {
        // help for sass file editing (need to consider better solution...)
        target: '../assets/',
        link: 'app/css/assets'
      },
      prep3: {
        // help for sass file editing (need to consider better solution...)
        target: '../../../assets/',
        link: 'app/css/cards/upload/assets'
      },
      bulkSymlink: {
        target: grunt.option('bulkSymlinkTarget'),
        link: grunt.option('bulkSymlinkLink'),
        options: {}
      }
    },
    bulkSymlink: {
      prep: {
        targets: bulkSymlinkLinks,
        dir: 'app/js/template/helpers/'
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
          'app/sass/*.sass',
          'app/cards/*/**.scss',
          'app/cards/*/**.sass',
          'app/cards/*/*/**.scss',
          'app/cards/*/*/**.sass'
        ],
        tasks: ['clean:beforeCompass', 'compass:dev', 'copy:beforeConcat', 'concat', 'cssmin']
      },
      ie: {
        files: ['app/ie/sass/*.scss', 'app/ie/sass/*.sass'],
        tasks: ['compass:ie']
      }
    },
    preprocess: {
      prep: {
        options: {
          inline: true,
          context: {
            mock: grunt.option('mock') || false,
            failAuth: grunt.option('failAuth') || false,
            failAuthSPDY: grunt.option('failAuthSPDY') || false,
            userLang: grunt.option('userLang'),
            blogLength: grunt.option('blogLength')
          }
        },
        files: {
          'app/js/main.js': 'app/preprocesses/main.preprocess'
        }
      },
      test: {
        options: {
          inline: true,
          context: {
            mock: "{}"
          }
        },
        files: {
          'app/js/main.js': 'app/preprocesses/main.preprocess'
        }
      },
      appcache: {
        options: {
          inline: true,
          context: {
            buildTime: Date.now()
          }
        },
        files: {
          '../mt-static/plugins/Loupe/manifest.appcache': 'app/preprocesses/manifest.preprocess.appcache'
        }
      },
      basket: {
        options: {
          inline: true,
          context: {
            buildTime: Date.now()
          }
        },
        files: {
          '../mt-static/plugins/Loupe/js/basket.js': 'app/preprocesses/basket.preprocess'
        }
      },
      easeljs: {
        options: {
          inline: true,
          context: {
            buildTime: Date.now()
          }
        },
        files: {
          'app/lib/EaselJS/easeljs.wrap.js': 'app/preprocesses/easeljs.preprocess'
        }
      }
    },
    connect: {
      server: {
        options: {
          hostname: grunt.option('host'),
          port: 9001,
          keepalive: true
        }
      },
      test: {
        options: {
          hostname: 'localhost',
          port: 9002,
          keepalive: true,
          middleware: function (connect, options) {
            return [
              function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', '*');
                next();
              },
              // Serve static files.
              connect.static(options.base),
              // Make empty directories browsable.
              connect.directory(options.base)
            ];
          }
        }
      },
      jasmine: {
        options: {
          hostname: 'localhost',
          port: 9003,
          middleware: function (connect, options) {
            return [
              function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', '*');
                next();
              },
              // Serve static files.
              connect.static(options.base),
              // Make empty directories browsable.
              connect.directory(options.base)
            ];
          }
        }
      }
    },
    jasmine: {
      test: {
        src: ['app'],
        options: {
          specs: specs,
          helpers: helpers.concat(['app/js/main.js']),
          host: 'http://localhost:9003/',
          outfile: '_SpecRunner.html',
          keepRunner: true,
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
            requireConfig: {
              baseUrl: 'app/',
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
          helpers: helpers.concat(['test/coverage.helper.js']),
          host: 'http://localhost:9002/',
          keepRunner: true,
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
      scss: {
        files: [{
          src: ['app/sass/*.scss', 'app/cards/**/*.scss']
        }]
      },
      sass: {
        files: [{
          src: ['app/sass/*.sass', 'app/cards/**/*.sass']
        }],
        options: {
          from: 'sass',
          to: 'sass'
        }
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
          '../mt-static/plugins/Loupe/index.html': '../mt-static/plugins/Loupe/index.html'
        }
      }
    },
    'string-replace': {
      build: {
        options: {
          replacements: [{
            pattern: /([,;])define\(/ig,
            replacement: '$1\ndefine('
          }, {
            pattern: /define\("[\-\.\w\/]*",function\(\)\{\}\);[\n]?/ig,
            replacement: ''
          }, {
            pattern: /;(require\(\["app"\])/,
            replacement: ';\n$1'
          }]
        },
        files: {
          '../mt-static/plugins/Loupe/js/app.js': '../mt-static/plugins/Loupe/js/app.js',
          '../mt-static/plugins/Loupe/js/template.js': '../mt-static/plugins/Loupe/js/template.js',
          '../mt-static/plugins/Loupe/js/vendor.js': '../mt-static/plugins/Loupe/js/vendor.js',
          '../mt-static/plugins/Loupe/js/card.js': '../mt-static/plugins/Loupe/js/card.js',
          '../mt-static/plugins/Loupe/js/l10n/de.js': '../mt-static/plugins/Loupe/js/l10n/de.js',
          '../mt-static/plugins/Loupe/js/l10n/es.js': '../mt-static/plugins/Loupe/js/l10n/es.js',
          '../mt-static/plugins/Loupe/js/l10n/fr.js': '../mt-static/plugins/Loupe/js/l10n/fr.js',
          '../mt-static/plugins/Loupe/js/l10n/ja.js': '../mt-static/plugins/Loupe/js/l10n/ja.js',
          '../mt-static/plugins/Loupe/js/l10n/nl.js': '../mt-static/plugins/Loupe/js/l10n/nl.js',
          '../mt-static/plugins/Loupe/js/l10n/en-us.js': '../mt-static/plugins/Loupe/js/l10n/en-us.js'
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
            dev: true,
            mtApiCGIPath: settings.mtApiCGIPath,
            mtApiPath: settings.mtApiPath,
            libPath: '.',
            manifestFile: null,
            csses: csses
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
            dev: false,
            mtApiCGIPath: '<mt:var name="api_cgi_path">',
            mtApiPath: '<mt:var name="api_path">',
            libPath: '<mt:var name="lib_path">',
            manifestFile: null
          }
        },
        files: {
          "../plugins/Loupe/tmpl/loupe.tmpl": "app/jade/index.jade"
        }
      }
    },
    uglify: {
      options: {
        beautify: {
          width: 1000000
        },
        compress: {
          sequences: false,
          global_defs: {
            DEBUG: false,
            Mock: false
          },
          unsafe: true
        },
        warnings: true,
        mangle: true,
        unsafe: true
      },
      basket: {
        files: {
          '../mt-static/plugins/Loupe/js/basket.js': ['../mt-static/plugins/Loupe/js/basket.js']
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
          include: ['json!cards/cards.json', 'js/l10n/ja', 'js/mtapi/mock'].concat(hbsTemplates).concat(cardTemplates).concat(langTemplates.ja),
          //exclude: ['handlebars', 'hbs'],
          exclude: ['hbs'],
          optimize: 'none',
          optimizeCss: 'none'
        }
      },
      build: {
        options: {
          appDir: "app",
          baseUrl: ".",
          mainConfigFile: 'app/js/main.js',
          paths: requireJSPaths,
          dir: "../mt-static/plugins/Loupe",
          modules: [{
            name: 'vendor',
            include: [
              "requireLib",
              "jquery",
              "jquery.hammer",
              "jquery.smartresize",
              "jquery.smartscroll",
              "underscore",
              "backbone",
              "backbone.localStorage",
              "backbone.wreqr",
              "backbone.babysitter",
              "backbone.marionette",
              "text",
              "json",
              "hbs",
              "handlebars",
              "i18nprecompile",
              "json2",
              "moment",
              "moment.lang",
              "eve",
              "raphael",
              "morris",
              "easeljs",
              "mtchart"
            ]
          }, {
            name: 'template',
            include: hbsTemplates,
            exclude: ['vendor']
          }, {
            name: 'app',
            include: ['js/trans'],
            exclude: ['vendor', 'template']
          }, {
            name: 'card',
            include: cardLibs.concat(cardTemplates).concat(['json!cards/cards.json']),
            exclude: ['vendor', 'template', 'app']
          }, {
            name: 'js/l10n/de',
            include: langTemplates.de,
            exclude: ['vendor', 'template', 'app', 'card']
          }, {
            name: 'js/l10n/es',
            include: langTemplates.es,
            exclude: ['vendor', 'template', 'app', 'card', 'js/l10n/de']
          }, {
            name: 'js/l10n/fr',
            include: langTemplates.fr,
            exclude: ['vendor', 'template', 'app', 'card', 'js/l10n/de', 'js/l10n/es']
          }, {
            name: 'js/l10n/ja',
            include: langTemplates.ja,
            exclude: ['vendor', 'template', 'app', 'card', 'js/l10n/de', 'js/l10n/es', 'js/l10n/fr']
          }, {
            name: 'js/l10n/nl',
            include: langTemplates.nl,
            exclude: ['vendor', 'template', 'app', 'card', 'js/l10n/de', 'js/l10n/es', 'js/l10n/fr', 'js/l10n/ja']
          }, {
            name: 'js/l10n/en-us',
            include: langTemplates['en-us'],
            exclude: ['vendor', 'template', 'app', 'card', 'js/l10n/de', 'js/l10n/es', 'js/l10n/fr', 'js/l10n/ja', 'js/l10n/nl']
          }],

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
                DEBUG: false,
                Mock: false
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
            disableI18n: true
          }
        }
      }
    },
    makeL10N: {
      core: {
        files: [{
          src: ['app/js/views/**/*.hbs'],
          dir: 'app/l10n/'
        }]
      },
      cards: {
        files: grunt.util._.map(grunt.file.expand({
          filter: 'isDirectory'
        }, 'app/cards/' + (grunt.option('card') || '*')), function (dir) {
          return {
            src: [dir + '/**/*.hbs'],
            dir: dir + '/l10n/'
          };
        }),
        options: {
          inherit: 'app/l10n/',
          reset: grunt.option('reset')
        }
      },
      concat: {
        files: [{
          src: ['app/js/views/**/*.hbs'],
          dir: 'app/l10n/'
        }].concat(
          grunt.util._.map(grunt.file.expand({
            filter: 'isDirectory'
          }, 'app/cards/' + (grunt.option('card') || '*')), function (dir) {
            return {
              src: [dir + '/**/*.hbs'],
              dir: dir + '/l10n/'
            };
          })),
        options: {
          inherit: 'app/l10n/',
          reset: grunt.option('reset'),
          concat: true
        }
      },
      options: {
        comments: grunt.option('comments'),
        findOnly: grunt.option('findOnly'),
        langs: grunt.option('langs')
      }
    },
    extendJSON: {
      l10n: {
        files: grunt.util._.map(langs, function (lang) {
          return {
            src: [(grunt.option('rootPath') ? grunt.option('rootPath') + '/' : '') + '**/' + lang + '.json'],
            dest: lang + '.json'
          };
        })
      }
    },
    sassVars: {
      dev: {
        dest: 'app/sass/_sass_grunt_vars.scss',
        options: {
          pathToPIE: 'ie/PIE/PIE.htc'
        }
      },
      build: {
        dest: 'app/sass/_sass_grunt_vars.scss',
        options: {
          pathToPIE: '../../plugins/loupe/ie/PIE/PIE.htc'
        }
      }
    }
  });

  grunt.registerTask('build', [
    'preprocess:prep',
    'symlink:prep',
    'copy:prep',
    'clean:build',
    'clean:beforeCompass',
    'sassVars:build',
    'compass:dev',
    'requirejs:build',
    'clean:afterBuild',
    'string-replace',
    'preprocess:basket',
    'uglify:basket',
    'copy:beforeConcat',
    'cssmin:build',
    'copy:build',
    'jade:build',
    'copy:beforeConcat',
    'concat:dev',
    'jade:dev',
    'symlink:prep2',
    'symlink:prep3'
  ]);

  grunt.registerTask('dev', [
    'preprocess:prep',
    'symlink:prep',
    'copy:prep',
    'sassVars:dev',
    'clean:beforeCompass',
    'compass:dev',
    'copy:beforeConcat',
    'concat:dev',
    'jade:dev',
    'symlink:prep2',
    'symlink:prep3'
  ]);

  grunt.registerTask('test', [
    'clean:beforeCoverage',
    'preprocess:test',
    'requirejs:test',
    'connect:jasmine',
    'jasmine',
    'open:test',
    'jshint'
  ]);

  grunt.registerTask('jasmineTest', [
    'connect:jasmine',
    'preprocess:test',
    'requirejs:test',
    'jasmine:test'
  ]);

  grunt.registerTask('none', []);
};
