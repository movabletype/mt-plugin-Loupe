define(function () {
  'use strict';

  var Device = function () {
    this.ua = navigator.userAgent;

    this.parseVersion = function (expression) {
      var version = this.ua.match(expression);
      version = (version && version[1]) ? (parseFloat(version[1].replace('_', '.'), 10) || null) : null;
      return version;
    };

    if (/Android/.test(this.ua)) {
      this.platform = 'android';
      this.version = this.parseVersion(/Android\s*([\.0-9]+)/);
    } else if (/iPhone|iPad|iPod/.test(this.ua)) {
      this.platform = 'ios';
      this.version = this.parseVersion(/(?:iPhone|iPad|iPod).*OS\s([_0-9]+)/);
    } else if (navigator.appName === 'Microsoft Internet Explorer') {
      this.platform = 'ie';
      this.version = this.parseVersion(/(?:MSIE|IE)\s*([\.0-9]+)/);
    }

    this.versionStr = this.version ? this.version.toString().replace(/\./, '-') : '';
    this.versionShortStr = this.versionStr.split(/-/)[0];

    this.isIE8 = this.versionStr === 'ie8';
  };

  return new Device();
});
