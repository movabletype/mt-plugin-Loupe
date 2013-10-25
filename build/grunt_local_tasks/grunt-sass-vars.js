module.exports = function (grunt) {
  'use strict';

  grunt.registerMultiTask('sassVars', 'save options as sass valiables', function () {
    var map = [];
    var options = this.options();
    grunt.util._.forIn(options, function (val, key) {
      map.push('$' + key.toString() + ': \"' + val.toString() + '\";');
    });
    grunt.file.write(this.data.dest, new Buffer(map.join('\n')));
  });
};
