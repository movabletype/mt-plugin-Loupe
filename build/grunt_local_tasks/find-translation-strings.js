// This task needed grep command capability

module.exports = function (grunt) {
  'use strict';

  grunt.registerMultiTask('findTranslationStrings', 'collects translation strings', function () {
    var options = this.options({
      comments: false,
      findOnly: false,
      inherit: false,
      copyStringsFromJa: false,
      reset: false,
      langs: ''
    });

    var cardJson = grunt.file.readJSON('app/cards/cards.json');

    grunt.util._.forEach(this.files, function (fs) {
      var dir = fs.dir;

      var langs = options.langs ? options.langs.split(',') : ['ja', 'en-us', 'de', 'es', 'fr', 'nl'];
      var trans = [];

      grunt.util._.forEach(fs.src, function (file) {
        var buf = grunt.file.read(file);
        var str = buf.toString();
        str = str.match(/\{\{\#trans trans\}\}(.+?)\{\{\/trans\}\}/g);
        if (str && str.length) {
          if (options.findOnly) {
            grunt.util._.forEach(str, function (s) {
              s = s.match(/\{\{\#trans trans\}\}(.+?)\{\{\/trans\}\}/)[1];
              grunt.log.writeln('"' + s + '" at ' + file);
            });
          } else {
            grunt.util._.forEach(str, function (s) {
              s = s.match(/\{\{\#trans trans\}\}(.+?)\{\{\/trans\}\}/)[1];
              if (/\{\{.*\}\}/.test(s)) {
                grunt.log.writeln('you need to add translations manually for value ' + s + ' at ' + file);
              } else {
                grunt.verbose.oklns('"' + s + '" at ' + file);
                if (!grunt.util._.find(trans, function (tran) {
                  return tran.str === s;
                })) {
                  trans.push({
                    str: s,
                    file: file
                  });
                }
              }
            });
            var cardId = dir.match(/\/cards\/([^\/]+)?/);
            if (cardId && cardId[1]) {
              var settings = grunt.util._.find(cardJson, function (c) {
                return c.id === cardId[1];
              });
              if (settings && !grunt.util._.find(trans, function (tran) {
                return tran.str === settings.name;
              })) {
                trans.push({
                  str: settings.name,
                  file: 'app/cards/cards.json'
                });
              }
            }
            trans = grunt.util._.uniq(trans)
          }
        }
      });
      if (!options.findOnly) {
        grunt.util._.forEach(langs, function (lang) {
          var path = dir + lang + '.json';
          var json, jsonClone, newStr = [];
          if (!options.reset && grunt.file.exists(path)) {
            json = grunt.file.readJSON(path);
            jsonClone = grunt.util._.clone(json);
            if (options.inherit) {
              jsonClone = grunt.util._.extend(jsonClone, grunt.file.readJSON(options.inherit + lang + '.json'));
            }
            grunt.util._.forIn(grunt.util._.clone(json), function (str, key) {
              if (str) {
                str = '  "' + key + '": "' + str + '",';
              } else {
                str = '  "' + key + '": ' + str + ',';
              }
              newStr.push(str);
            });
          } else {
            json = {};
            jsonClone = {};
            if (options.inherit) {
              jsonClone = grunt.util._.extend(jsonClone, grunt.file.readJSON(options.inherit + lang + '.json'));
            }
          }
          if (options.copyStringsFromJa) {
            var jaJson = grunt.file.readJSON(dir + 'ja.json');
            var jaTrans = [];
            var tran;
            grunt.util._.forIn(jaJson, function (str, key) {
              if (!grunt.util._.find(trans.concat(jaTrans), function (tran) {
                return tran.str === key;
              })) {
                tran = {
                  str: key,
                  file: dir + 'ja.json'
                };
                jaTrans.push(tran);
              }
            });
            trans = trans.concat(jaTrans);
          }
          grunt.util._.forEach(trans, function (tran) {
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
          newStr = grunt.util._.sortBy(newStr, function (str) {
            return str.toLowerCase()
          }).join('\n').replace(/,$/, '');
          grunt.file.write(dir + lang + '.json', new Buffer('{\n' + newStr + '\n}\n'));
        });
      }
    });
  });
};
