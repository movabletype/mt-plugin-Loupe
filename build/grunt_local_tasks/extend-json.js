// This task needed grep command capability

module.exports = function (grunt) {
  'use strict';

  var TempDir = require('temporary/lib/dir');
  var tempDir = new TempDir();
  var _ = grunt.util._;

  grunt.registerMultiTask('extendJSON', 'just execute _.extend to unify JSON objects', function () {
    var options = this.options({});

    _.forEach(this.files, function (fs) {
      var dest = fs.dest;
      var json = {};

      _.forEach(fs.src, function (file) {
        var file = grunt.file.readJSON(file, {
          encoding: "utf8"
        });
        json = _.extend(json, file);
      });
      // sort by key and value
      var keyHasValues = {};
      var keyNoValues = {};

      _.forOwn(json, function (str, key) {
        if (str !== null) {
          keyHasValues[key] = str;
        } else {
          keyNoValues[key] = str;
        }
      });

      _.sortBy(keyHasValues, function (str, key) {
        return key.toLowerCase();
      });

      _.sortBy(keyNoValues, function (str, key) {
        return key.toLowerCase();
      });

      json = _.extend({}, keyHasValues, keyNoValues);


      grunt.file.write(tempDir.path + '/' + dest, new Buffer(JSON.stringify(json, null, '  ')));
    });

    grunt.log.writeln('\n');
    grunt.log.writeln('========================================================================================');
    grunt.log.writeln('create JSON object in temp directory');
    grunt.log.writeln(tempDir.path);
    grunt.log.writeln('========================================================================================');
  });
};
