// This task needed grep command capability

module.exports = function (grunt) {
  'use strict';

  var TempDir = require('temporary/lib/dir');
  var tempDir = new TempDir();
  var _ = grunt.util._;

  grunt.registerMultiTask('makeL10N', 'collects translation strings', function () {
    var options = this.options({
      comments: false,
      findOnly: false,
      inherit: false,
      reset: false,
      langs: ''
    });

    var cardJson = grunt.file.readJSON('app/cards/cards.json');
    var done = this.async();
    var langs = options.langs ? options.langs.split(',') : ['ja', 'en-us', 'de', 'es', 'fr', 'nl'];

    _.forEach(this.files, function (fs) {
      var dir = fs.dir;
      var trans = [];

      // grep trans block in *.hbs files
      _.forEach(fs.src, function (file) {
        var buf = grunt.file.read(file);
        var str = buf.toString();
        str = str.match(/\{\{\#trans (?:..\/)*trans\}\}(.+?)\{\{\/trans\}\}/g);
        if (str && str.length) {
          _.forEach(str, function (s) {
            s = s.match(/\{\{\#trans (?:..\/)*trans\}\}(.+?)\{\{\/trans\}\}/)[1];
            if (/\{\{.*\}\}/.test(s)) {
              if (options.findOnly) {
                trans.push({
                  str: s,
                  file: file
                });
              } else {
                grunt.verbose.writeln('you need to add translations manually for value ' + s + ' at ' + file);
              }
            } else {
              grunt.verbose.oklns('"' + s + '" at ' + file);
              if (!_.find(trans, function (tran) {
                return tran.str === s;
              })) {
                trans.push({
                  str: s,
                  file: file
                });
              }
            }
          });

          // added card.name as translation candidates
          var cardId = dir.match(/\/cards\/([^\/]+)?/);
          if (cardId && cardId[1]) {
            var settings = _.find(cardJson, function (c) {
              return c.id === cardId[1];
            });
            if (settings && !_.find(trans, function (tran) {
              return tran.str === settings.name;
            })) {
              trans.push({
                str: settings.name,
                file: 'app/cards/cards.json'
              });
            }

            // and load strings.json in each card
            _.forEach(grunt.file.expand('app/cards/' + cardId[1] + '/**/strings.json'), function (stringJSONPath) {
              var array = grunt.file.readJSON(stringJSONPath);
              _.forEach(array, function (item) {
                if (!_.find(trans, function (tran) {
                  return tran.str === item
                })) {
                  trans.push({
                    str: item,
                    file: stringJSONPath
                  });
                }
              })
            });
          } else {
            // load strings.json in core l10n
            _.forEach(grunt.file.expand('app/l10n/strings.json'), function (stringJSONPath) {
              var array = grunt.file.readJSON(stringJSONPath);
              _.forEach(array, function (item) {
                if (!_.find(trans, function (tran) {
                  return tran.str === item
                })) {
                  trans.push({
                    str: item,
                    file: stringJSONPath
                  });
                }
              })
            });
          }
          trans = _.uniq(trans);
        }
      });

      if (options.findOnly) {
        _.forEach(trans, function (tran) {
          grunt.log.writeln('"' + tran.str + '" at ' + tran.file);
        });
        done();
      } else {
        grunt.util.async.forEachSeries(langs, function (lang, next) {
          var path, json, jsonClone, newStr = [];
          path = dir + lang + '.json';

          // load existence json object for finding newly strings after that
          if (!options.reset && grunt.file.exists(path)) {
            json = grunt.file.readJSON(path);
            jsonClone = _.clone(json);
            if (options.inherit && options.inherit !== dir) {
              jsonClone = _.extend(grunt.file.readJSON(options.inherit + lang + '.json'), jsonClone);
            }
            _.forIn(_.clone(json), function (str, key) {
              if (str !== null) {
                str = '  "' + key + '": "' + str + '",';
              } else {
                str = '  "' + key + '": ' + str + ',';
              }
              newStr.push(str);
            });
          } else {
            json = {};
            jsonClone = {};
          }

          // check whether It's a new string and then add it.
          _.forEach(trans, function (tran) {
            var str;
            if (typeof jsonClone[tran.str] !== 'undefined') {
              grunt.verbose.writeln('"' + tran.str + '" is already have been translated');
            } else {
              str = '  "' + tran.str + '": null,';
              if (options.comments) {
                str += ' // ' + tran.file;
              }
              newStr.push(str);
            }
          });

          // sort by name
          newStr = _.sortBy(newStr, function (str) {
            return str.toLowerCase()
          }).join('\n').replace(/,$/, '');

          // write new json file in temporary directory
          grunt.file.write(tempDir.path + '/' + path, new Buffer('{\n' + newStr + '\n}\n'));
          next();
        }, function () {
          // if in concat mode, spawn extendJSON task to unify json files into one file
          if (options.concat) {
            grunt.util.spawn({
              grunt: true,
              args: ['extendJSON:l10n', '--rootPath', tempDir.path]
            }, function (error, result, code) {
              grunt.log.write(result.stdout);
              done();
            });
          } else {
            grunt.log.ok('create l10n JSON files in ' + tempDir.path);
            done();
          }
        });
      }
    });
  });
};
