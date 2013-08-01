describe("device", function () {
  'use strict';

  var uaList = {
    'iphone': {
      '5.0': {
        version: 5.0,
        versionShortStr: '5',
        versionStr: '5-0',
        ua: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9A334 Safari/7534.48.3'
      },
      '5.0.1': {
        version: 5.0,
        versionShortStr: '5',
        versionStr: '5-0',
        ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9A405 Safari/7534.48.3'
      },
      '6.0': {
        version: 6.0,
        versionShortStr: '6',
        versionStr: '6-0',
        ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A403 Safari/8536.25'
      },
      '6.1.3': {
        version: 6.1,
        versionShortStr: '6',
        versionStr: '6-1',
        ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B329 Safari/8536.25'
      }
    },
    'ipod': {
      '5.1': {
        version: 5.1,
        versionShortStr: '5',
        versionStr: '5-1',
        ua: 'Mozilla/5.0 (iPod; CPU iPhone OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9B176 Safari/7534.48.3'
      }
    },
    'ipad': {
      '5.1': {
        version: 5.1,
        versionShortStr: '5',
        versionStr: '5-1',
        ua: 'Mozilla/5.0 (iPad; CPU OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9B176 Safari/7534.48.3'
      },
      '6.0': {
        version: 6.0,
        versionShortStr: '6',
        versionStr: '6-0',
        ua: 'Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A403 Safari/8536.25'
      }
    },
    'android': {
      '2.3.3-1': {
        version: 2.3,
        versionShortStr: '2',
        versionStr: '2-3',
        ua: 'Mozilla/5.0 (Linux; U; Android 2.3.3; ja-jp; SC-02C Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1'
      },
      '2.3.3-2': {
        version: 2.3,
        versionShortStr: '2',
        versionStr: '2-3',
        ua: 'Mozilla/5.0 (Linux; U; Android 2.3.3; ja-jp; INFOBAR A01 Build/S9081) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1'
      },
      '2.3.3-3': {
        version: 2.3,
        versionShortStr: '2',
        versionStr: '2-3',
        ua: 'Mozilla/5.0 (Linux; U; Android 2.3.3; ja-jp; 001HT Build/GRI40) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1'
      },
      '2.3.4': {
        version: 2.3,
        versionShortStr: '2',
        versionStr: '2-3',
        ua: 'Mozilla/5.0 (Linux; U; Android 2.3.4; ja-jp; SonyEricssonSO-01C Build/4.0.1.C.1.31) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1'
      },
      '4.0.1': {
        version: 4.0,
        versionShortStr: '4',
        versionStr: '4-0',
        ua: 'Mozilla/5.0 (Linux; U; Android 4.0.1; ja-jp; Galaxy Nexus Build/ITL41D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
      },
      '4.0.3-1': {
        version: 4.0,
        versionShortStr: '4',
        versionStr: '4-0',
        ua: 'Mozilla/5.0 (Linux; U; Android 4.0.3; ja-jp; URBANO PROGRESSO Build/010.0.3000) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
      },
      '4.0.3-2': {
        version: 4.0,
        versionShortStr: '4',
        versionStr: '4-0',
        ua: 'Mozilla/5.0 (Linux; U; Android 4.0.3; ja-jp; Sony Tablet S Build/TISU0R0110) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30'
      },
      '4.0.4': {
        version: 4.0,
        versionShortStr: '4',
        versionStr: '4-0',
        ua: 'Mozilla/5.0 (Linux; U; Android 4.0.4; ja-jp; SC-06D Build/IMM76D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
      },
      '4.1.1-1': {
        version: 4.1,
        versionShortStr: '4',
        versionStr: '4-1',
        ua: 'Mozilla/5.0 (Linux; U; Android 4.1.1; ja-jp; Galaxy Nexus Build/JRO03H) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
      },
      '4.1.1-2': {
        version: 4.1,
        versionShortStr: '4',
        versionStr: '4-1',
        ua: 'Mozilla/5.0 (Linux; Android 4.1.1; Nexus 7 Build/JRO03S) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Safari/535.19'
      },
      '4.2.1': {
        version: 4.2,
        versionShortStr: '4',
        versionStr: '4-2',
        ua: 'Mozilla/5.0 (Linux; U; Android 4.2.1; ja-jp; Galaxy Nexus Build/JOP40D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
      },
      '4.2.2': {
        version: 4.2,
        versionShortStr: '4',
        versionStr: '4-2',
        ua: 'Mozilla/5.0 (Linux; U; Android 4.2.2; ja-jp; SHL22 Build/S6290) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
      }
    },
    'windows-phone': {
      '7.5': {
        version: 7.5,
        versionShortStr: '7',
        versionStr: '7-5',
        browser: 'ie',
        browserVersion: 9.0,
        browserVersionStr: '9-0',
        browserVersionShortStr: '9',
        ua: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; FujitsuToshibaMobileCommun; IS12T; KDDI)'
      },
      '8.0': {
        version: 8.0,
        versionShortStr: '8',
        versionStr: '8-0',
        browser: 'ie',
        browserVersion: 10.0,
        browserVersionStr: '10-0',
        browserVersionShortStr: '10',
        ua: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 620)'
      }
    },
    'ie': {
      '8.0': {
        browser: 'ie',
        browserVersion: 8.0,
        browserVersionStr: '8-0',
        browserVersionShortStr: '8',
        ua: 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET4.0C; .NET4.0E)'
      },
      '9.0': {
        browser: 'ie',
        browserVersion: 9.0,
        browserVersionStr: '9-0',
        browserVersionShortStr: '9',
        ua: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C)'
      },
      '10.0': {
        browser: 'ie',
        browserVersion: 10.0,
        browserVersionStr: '10-0',
        browserVersionShortStr: '10',
        ua: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0; .NET4.0E; .NET4.0C; Tablet PC 2.0)'
      },
      '11.0': {
        browser: 'ie',
        browserVersion: 11.0,
        browserVersionStr: '11-0',
        browserVersionShortStr: '11',
        ua: 'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; rv:11.0) like Gecko'
      }
    },
    'firefox': {
      '22': {
        browser: 'firefox',
        browserVersion: 22.0,
        browserVersionStr: '22-0',
        browserVersionShortStr: '22',
        ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:22.0) Gecko/20100101 Firefox/22.0'
      }
    }
  };

  beforeEach(function () {
    require.undef('js/device');
    $('script[src$="app/js/device.js"]').remove();
    window.Mock.appName = null;
  });

  $.each(['2.3.3-1', '2.3.3-2', '2.3.3-3', '2.3.4', '4.0.1', '4.0.3-1', '4.0.3-2', '4.0.4', '4.1.1-1', '4.1.1-2', '4.2.1', '4.2.2'], function (i, ver) {
    it("android " + ver, function () {
      var dv = uaList.android[ver];
      window.Mock.userAgent = dv.ua;

      var flag = false;
      runs(require(['js/device'], function () {
        flag = true;
      }));

      waitsFor(function () {
        return flag;
      }, 'required failed', 10000);

      runs(function () {
        var device = require('js/device');
        expect(device.ua).toEqual(dv.ua);
        expect(device.isAndroid).toBe(true);
        expect(device.isIOS).not.toBeDefined();
        expect(device.isWindowsPhone).not.toBeDefined();
        expect(device.isFirefox).not.toBeDefined();
        expect(device.platform).toEqual('android');
        expect(device.version).toEqual(dv.version);
        expect(device.versionShortStr).toEqual(dv.versionShortStr);
        expect(device.versionStr).toEqual(dv.versionStr);
        expect(device.browser).not.toBeDefined();
        expect(device.browserVersion).not.toBeDefined();
        expect(device.browserVersionShortStr).toEqual('');
        expect(device.browserVersionStr).toEqual('');
      });
    });
  });

  $.each(['5.0', '5.0.1', '6.0', '6.1.3'], function (i, ver) {
    it("iphone " + ver, function () {
      var dv = uaList.iphone[ver];
      window.Mock.userAgent = dv.ua;

      var flag = false;
      runs(require(['js/device'], function () {
        flag = true;
      }));

      waitsFor(function () {
        return flag;
      }, 'required failed', 10000);

      runs(function () {
        var device = require('js/device');
        expect(device.ua).toEqual(dv.ua);
        expect(device.isAndroid).not.toBeDefined();
        expect(device.isIOS).toBe(true);
        expect(device.isWindowsPhone).not.toBeDefined();
        expect(device.isFirefox).not.toBeDefined();
        expect(device.platform).toEqual('ios');
        expect(device.version).toEqual(dv.version);
        expect(device.versionShortStr).toEqual(dv.versionShortStr);
        expect(device.versionStr).toEqual(dv.versionStr);
        expect(device.browser).not.toBeDefined();
        expect(device.browserVersion).not.toBeDefined();
        expect(device.browserVersionShortStr).toEqual('');
        expect(device.browserVersionStr).toEqual('');
      });
    });
  });

  $.each(['5.1'], function (i, ver) {
    it("ipod " + ver, function () {
      var dv = uaList.ipod[ver];
      window.Mock.userAgent = dv.ua;

      var flag = false;
      runs(require(['js/device'], function () {
        flag = true;
      }));

      waitsFor(function () {
        return flag;
      }, 'required failed', 10000);

      runs(function () {
        var device = require('js/device');
        expect(device.ua).toEqual(dv.ua);
        expect(device.isAndroid).not.toBeDefined();
        expect(device.isIOS).toBe(true);
        expect(device.isWindowsPhone).not.toBeDefined();
        expect(device.isFirefox).not.toBeDefined();
        expect(device.platform).toEqual('ios');
        expect(device.version).toEqual(dv.version);
        expect(device.versionShortStr).toEqual(dv.versionShortStr);
        expect(device.versionStr).toEqual(dv.versionStr);
        expect(device.browser).not.toBeDefined();
        expect(device.browserVersion).not.toBeDefined();
        expect(device.browserVersionShortStr).toEqual('');
        expect(device.browserVersionStr).toEqual('');
      });
    });
  });

  $.each(['5.1', '6.0'], function (i, ver) {
    it("ipad " + ver, function () {
      var dv = uaList.ipad[ver];
      window.Mock.userAgent = dv.ua;

      var flag = false;
      runs(require(['js/device'], function () {
        flag = true;
      }));

      waitsFor(function () {
        return flag;
      }, 'required failed', 10000);

      runs(function () {
        var device = require('js/device');
        expect(device.ua).toEqual(dv.ua);
        expect(device.isAndroid).not.toBeDefined();
        expect(device.isIOS).toBe(true);
        expect(device.isWindowsPhone).not.toBeDefined();
        expect(device.isFirefox).not.toBeDefined();
        expect(device.platform).toEqual('ios');
        expect(device.version).toEqual(dv.version);
        expect(device.versionShortStr).toEqual(dv.versionShortStr);
        expect(device.versionStr).toEqual(dv.versionStr);
        expect(device.browser).not.toBeDefined();
        expect(device.browserVersion).not.toBeDefined();
        expect(device.browserVersionShortStr).toEqual('');
        expect(device.browserVersionStr).toEqual('');
      });
    });
  });
  $.each(['7.5', '8.0'], function (i, ver) {
    it("windows phone " + ver, function () {
      var dv = uaList['windows-phone'][ver];
      window.Mock.userAgent = dv.ua;
      window.Mock.appName = 'Microsoft Internet Explorer';

      var flag = false;
      runs(require(['js/device'], function () {
        flag = true;
      }));

      waitsFor(function () {
        return flag;
      }, 'required failed', 10000);

      runs(function () {
        var device = require('js/device');
        expect(device.ua).toEqual(dv.ua);
        expect(device.isAndroid).not.toBeDefined();
        expect(device.isIOS).not.toBeDefined();
        expect(device.isWindowsPhone).toBe(true);
        expect(device.isFirefox).not.toBeDefined();
        expect(device.platform).toEqual('windows-phone');
        expect(device.version).toEqual(dv.version);
        expect(device.versionShortStr).toEqual(dv.versionShortStr);
        expect(device.versionStr).toEqual(dv.versionStr);
        expect(device.browser).toEqual('ie');
        expect(device.browserVersion).toEqual(dv.browserVersion);
        expect(device.browserVersionShortStr).toEqual(dv.browserVersionShortStr);
        expect(device.browserVersionStr).toEqual(dv.browserVersionStr);
      });
    });
  });
  $.each(['8.0', '9.0', '10.0', '11.0'], function (i, ver) {
    it("ie " + ver, function () {
      var dv = uaList.ie[ver];
      window.Mock.userAgent = dv.ua;
      if (parseInt(ver, 10) < 11) {
        window.Mock.appName = 'Microsoft Internet Explorer';
      } else {
        window.Mock.appName = 'Netscape';
      }

      var flag = false;
      runs(require(['js/device'], function () {
        flag = true;
      }));

      waitsFor(function () {
        return flag;
      }, 'required failed', 10000);

      runs(function () {
        var device = require('js/device');
        expect(device.ua).toEqual(dv.ua);
        expect(device.isAndroid).not.toBeDefined();
        expect(device.isIOS).not.toBeDefined();
        expect(device.isWindowsPhone).not.toBeDefined();
        expect(device.isFirefox).not.toBeDefined();
        expect(device.platform).not.toBeDefined();
        expect(device.version).not.toBeDefined();
        expect(device.versionShortStr).toEqual('');
        expect(device.versionStr).toEqual('');
        expect(device.browser).toEqual('ie');
        expect(device.browserVersion).toEqual(dv.browserVersion);
        expect(device.browserVersionShortStr).toEqual(dv.browserVersionShortStr);
        expect(device.browserVersionStr).toEqual(dv.browserVersionStr);
      });
    });
  });
  $.each(['22'], function (i, ver) {
    it("Firefox " + ver, function () {
      var dv = uaList.firefox[ver];
      window.Mock.userAgent = dv.ua;

      var flag = false;
      runs(require(['js/device'], function () {
        flag = true;
      }));

      waitsFor(function () {
        return flag;
      }, 'required failed', 10000);

      runs(function () {
        var device = require('js/device');
        expect(device.ua).toEqual(dv.ua);
        expect(device.isAndroid).not.toBeDefined();
        expect(device.isIOS).not.toBeDefined();
        expect(device.isWindowsPhone).not.toBeDefined();
        expect(device.isFirefox).toBe(true);
        expect(device.platform).not.toBeDefined();
        expect(device.version).not.toBeDefined();
        expect(device.versionShortStr).toEqual('');
        expect(device.versionStr).toEqual('');
        expect(device.browser).toEqual('firefox');
        expect(device.browserVersion).toEqual(dv.browserVersion);
        expect(device.browserVersionShortStr).toEqual(dv.browserVersionShortStr);
        expect(device.browserVersionStr).toEqual(dv.browserVersionStr);
      });
    });
  });
});
