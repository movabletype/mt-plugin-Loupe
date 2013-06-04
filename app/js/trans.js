define(function () {
  'use strict';

  var Trans = function (l10n, namespace) {
    this.l10n = l10n;
    this.namespace = namespace || null;
  };

  Trans.prototype.trans = function (str) {
    str = this.l10n.get(this.namespace, str) || this.l10n.get('common', str) || str;

    if (arguments.length > 1) {
      for (var i = 1; i <= arguments.length; i++) {
        /* This matches [_#] or [_#:comment] */
        str = str.replace(new RegExp('\\[_' + i + '(?::[^\\]]+)?\\]', 'g'), arguments[i]);
        var re = new RegExp('\\[quant,_' + i + ',(.+?)(?:,(.+?))?(?::[^\\]]+)?\\]');
        var matches;
        while (matches = str.match(re)) {
          if (arguments[i] !== 1) {
            str = str.replace(re, arguments[i] + ' ' +
              ((typeof (matches[2]) !== 'undefined') ? matches[2] : matches[1] + 's'));
          } else {
            str = str.replace(re, arguments[i] + ' ' + matches[1]);
          }
        }
      }
    }
    return str;
  };

  return Trans;
});
