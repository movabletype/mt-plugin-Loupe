/*global module:false*/
module.exports = function (grunt) {

  'use strict';

  require('matchdep').filterDev('grunt-*').forEach(function (name) {
    if (!/template/.test(name)) {
      grunt.loadNpmTasks(name);
    }
  });

  var requireConfig = grunt.file.readJSON('./app/js/require.config.json');

  var requireJSPaths = {
    "requireLib": "lib/require",
    "underscore": "components/underscore/underscore-min",
    "backbone": "components/backbone/backbone-min",
    "backbone.localStorage": "components/backbone.localStorage/backbone.localStorage-min",
    "jquery": "lib/jquery/jquery-1.10.1.min",
    "jquery.hammer": "components/hammerjs/dist/jquery.hammer.min",
    "backbone.wreqr": "components/backbone.wreqr/lib/amd/backbone.wreqr.min",
    "backbone.babysitter": "components/backbone.babysitter/lib/amd/backbone.babysitter.min",
    "backbone.marionette": "components/backbone.marionette/lib/core/amd/backbone.marionette.min",
    "moment": "components/moment/min/moment.min",
    "moment.lang": "components/moment/min/langs",
    "morris": "components/morris.js/morris.min",
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
  var helpers = ['test/template.js', 'test/helper.js'];
  grunt.util._.forEach(grunt.file.expand('spec/**/*.js').concat(grunt.file.expand('app/cards/*/spec/*.js')), function (src) {
    if (/_helper.js/.test(src)) {
      helpers.push(src);
    } else {
      specs.push(src);
    }
  });

  var testTarget = ['app/js/app.js', 'app/js/vent.js'].concat(grunt.file.expand('app/js/*/**/*.js')).concat(cardLibsForJasmine);

  var settings = grunt.file.readJSON('settings.json');

  var bulkSymlinkLinks = grunt.file.expand('app/cards/*/templates/helpers/*.js').map(function (filename) {
    return '../../../' + filename.replace('app/', '');
  });

  // Project configuration.
  grunt.initConfig({
    jshint: {
      options: grunt.file.readJSON('.jshintrc'),
      gruntfile: {
        options: {
          unused: false,
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
          specify: ['app/sass/*.scss', 'app/cards/*/*.scss', 'app/cards/*/sass/*.scss']
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
          'build/css/style.css': ['app/css/*/**/*.css']
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
          'build/etc',
          'build/index.html',
          'build/jade',
          'build/js/boot.js',
          'build/js/cache.js',
          'build/js/collections',
          'build/js/device.js',
          'build/js/models',
          'build/js/commands.js',
          'build/js/mtapi',
          'build/js/mtapi.js',
          'build/js/perf.js',
          'build/js/router',
          'build/js/main.js',
          'build/js/main.preprocess.js',
          'build/js/require.config.json',
          'build/js/l10n.js',
          'build/js/lib',
          'build/js/layouts',
          'build/js/require.js',
          'build/js/template',
          'build/js/trans.js',
          'build/js/vent.js',
          'build/js/views',
          'build/lib',
          'build/sass',
          'build/template',
          'build/templates',
          'build/cards',
          'build/assets/icons/index.html',
          'build/assets/icons/license.txt',
          'build/assets/icons/Read Me.txt'
      ],
      afterTest: ['template.js']
    },
    copy: {
      prep: {
        files: [{
            expand: true,
            src: ['app/lib/chart-api/mtchart.css'],
            dest: 'app/css/lib/',
            flatten: true
          }
        ]
      },
      build: {
        files: [{
            expand: true,
            cwd: 'app/',
            src: ['cards/**/assets/**'],
            dest: 'build',
            filter: 'isFile'
          }
        ]
      },
      beforeConcat: {
        files: [{
            expand: true,
            cwd: 'app/',
            src: ['cards/**/*.css'],
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
    //    imagemin: {
    //      build: {
    //        files: [{
    //            expand: true,
    //            cwd: 'app/images',
    //            src: '*.{png,jpg,jpeg}',
    //            dest: 'build/images'
    //          }
    //        ]
    //      }
    //    },
    watch: {
      index: {
        files: 'app/jade/*.jade',
        tasks: ['jade']
      },
      css: {
        files: [
            'app/sass/*.scss',
            'app/cards/*/**.scss',
            'app/cards/*/*/**.scss'
        ],
        tasks: ['clean:beforeCompass', 'compass:dev', 'copy:beforeConcat', 'concat', 'cssmin']
      },
      ie: {
        files: ['app/ie/sass/*.scss'],
        tasks: ['compass:ie']
      }
    },
    preprocess: {
      prep: {
        files: {
          'app/js/main.js': 'app/js/main.preprocess.js'
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
          'build/manifest.appcache': 'app/etc/manifest.preprocess.appcache'
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
        src: ['app/sass/*.scss', 'app/cards/**/*.scss']
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
          replacements: [{
              pattern: /([,;])define\(/ig,
              replacement: '$1\ndefine('
            }, {
              pattern: /define\("[\-\.\w\/]*",function\(\)\{\}\);[\n]?/ig,
              replacement: ''
            }, {
              pattern: /;(require\(\["app"\])/,
              replacement: ';\n$1'
            }
          ]
        },
        files: {
          'build/js/app.js': 'build/js/app.js',
          'build/js/template.js': 'build/js/template.js',
          'build/js/vendor.js': 'build/js/vendor.js',
          'build/js/card.js': 'build/js/card.js',
          'build/l10n/de.js': 'build/l10n/de.js',
          'build/l10n/es.js': 'build/l10n/es.js',
          'build/l10n/fr.js': 'build/l10n/fr.js',
          'build/l10n/ja.js': 'build/l10n/ja.js',
          'build/l10n/nl.js': 'build/l10n/nl.js'
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
            manifestFile: null
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
            mtApiCGIPath: settings.mtApiCGIPath,
            mtApiPath: settings.mtApiPath,
            libPath: settings.libPath,
            manifestFile: null
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
          include: ['lib/require', 'json!cards/stats/settings.json', 'json!cards/cards.json'].concat(hbsTemplates).concat(cardTemplates),
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
          paths: requireJSPaths,
          dir: "build",
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
              include: ['boot', 'js/trans'],
              exclude: ['vendor', 'template']
            }, {
              name: 'card',
              include: cardLibs.concat(cardTemplates),
              exclude: ['vendor', 'template', 'app']
            }, {
              name: 'l10n/de',
              include: langTemplates.de,
              exclude: ['vendor', 'template', 'app', 'card']
            }, {
              name: 'l10n/es',
              include: langTemplates.es,
              exclude: ['vendor', 'template', 'app', 'card', 'l10n/de']
            }, {
              name: 'l10n/fr',
              include: langTemplates.fr,
              exclude: ['vendor', 'template', 'app', 'card', 'l10n/de', 'l10n/es']
            }, {
              name: 'l10n/ja',
              include: langTemplates.ja,
              exclude: ['vendor', 'template', 'app', 'card', 'l10n/de', 'l10n/es', 'l10n/fr']
            }, {
              name: 'l10n/nl',
              include: langTemplates.nl,
              exclude: ['vendor', 'template', 'app', 'card', 'l10n/de', 'l10n/es', 'l10n/fr', 'l10n/ja']
            }, {
              name: 'l10n/en-us',
              include: langTemplates.nl,
              exclude: ['vendor', 'template', 'app', 'card', 'l10n/de', 'l10n/es', 'l10n/fr', 'l10n/ja', 'l10n/nl']
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
            disableI18n: true
          }
        }
      }
    }
  });

  grunt.registerTask('build', [
      'symlink:prep',
      'copy:prep',
      'clean:build',
    // 'imagemin',
    'clean:beforeCompass',
      'compass',
      'requirejs:build',
      'clean:afterBuild',
      'string-replace',
      'copy:beforeConcat',
      'cssmin:build',
      'copy:build',
      'jade:build',
      'copy:beforeConcat',
      'concat:dev'
  ]);

  grunt.registerTask('dev', [
      'symlink:prep',
      'copy:prep',
      'jade:dev',
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
