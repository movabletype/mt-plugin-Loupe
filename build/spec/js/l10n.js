describe("l10n", function () {
  'use strict';

  var L10N = require('js/l10n');
  window.buildTime = (new Date()).valueOf();

  define('json!l10n/es.json', function () {
    return {
      "foo": "bar"
    };
  });

  beforeEach(function () {
    var base = window.requireBaseUrl ? 'spec' : 'spec'
    $('body').append('<div id="main-script" data-base="' + base + '" >');
  });

  it("load Common", function () {
    var l10n = new L10N('es');

    var flag = false;
    runs(function () {
      l10n.loadCommonDfd.done(function () {
        flag = true;
      })
    });

    waitsFor(function () {
      return flag;
    }, 'timeout error', 3000);

    runs(function () {
      expect(l10n.common).toBeDefined();
      expect(l10n.common).not.toBeNull();
      expect(l10n.common.foo).toEqual('bar');
    });

    runs(function () {
      require.undef('json!l10n/en-us.json');
    })
  });

  if (!window.requireBaseUrl) {
    it("load Common with basket.js", function () {
      var flag = false;
      var flag2 = false;
      var l10n;

      runs(require(['basket'], function () {
        flag = true;
      }));

      waitsFor(function () {
        return flag;
      }, 'failed to load basket.js', 3000);

      runs(function () {
        spyOn(window.basket, 'require').andCallThrough();
        l10n = new L10N('en-us');
        l10n.loadCommonDfd.done(function () {
          flag2 = true;
        });
      });

      waitsFor(function () {
        return flag2;
      }, 'failed load common l10n', 3000);

      runs(function () {
        expect(l10n.common).toBeDefined();
        expect(l10n.common).not.toBeNull();
        expect(window.basket.require).toHaveBeenCalled();
        expect(l10n.common.bar).toEqual('baz');
        window.basket = undefined;
        require.undef('basket');
        require.undef('json!l10n/en-us.json');
        $('script[src$="basket.full.min.js"]').remove();
        $('script[defer]').remove();
      })
    })
  }

  afterEach(function () {
    $('#main-script').remove();
  });
});
