describe("l10n", function () {
  'use strict';

  var L10N = require('js/l10n');
  var base = '/spec';
  window.buildTime = (new Date()).valueOf();

  beforeEach(function () {
    $('body').append('<div id="main-script" data-base="' + base + '" >');
  });

  it("load Common", function () {
    require.undef('json!l10n/ja.json');
    define('json!l10n/ja.json', function () {
      return {
        "foo": "bar"
      };
    });

    var l10n = new L10N('ja');

    var flag = false;
    runs(function () {
      l10n.loadCommonDfd.done(function () {
        flag = true;
      });
    });

    waitsFor(function () {
      return flag;
    }, 'timeout error', 3000);

    runs(function () {
      expect(l10n.common).toBeDefined();
      expect(l10n.common).not.toBeNull();
      expect(l10n.get('common', 'foo')).toEqual('bar');
    });

    runs(function () {
      require.undef('json!l10n/en-us.json');
    });
  });

  it("When user has already loaded common l10n, imediately return deferred object", function () {
    require.undef('json!l10n/ja.json');
    define('json!l10n/ja.json', function () {
      return {
        "foo": "bar"
      };
    });

    var l10n = new L10N('ja');

    var flag, flag2;
    runs(function () {
      l10n.loadCommonDfd.done(function () {
        flag = true;
      });
    });

    waitsFor(function () {
      return flag;
    }, 'timeout error', 3000);

    runs(function () {
      expect(l10n.common).toBeDefined();
      expect(l10n.common).not.toBeNull();
      expect(l10n.get('common', 'foo')).toEqual('bar');
      spyOn(window, 'require').andCallThrough();
      l10n.loadCommon().done(function () {
        flag2 = true;
      });
    });

    waitsFor(function () {
      return flag2;
    }, 'timeout error', 3000);

    runs(function () {
      expect(l10n.get('common', 'foo')).toEqual('bar');
      expect(window.require).not.toHaveBeenCalled();
    });
  });

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
      require.undef('json!l10n/en-us.json');
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
      expect(l10n.get('common', 'bar')).toEqual('baz');
      window.basket = undefined;
      require.undef('basket');
      require.undef('json!l10n/en-us.json');
      $('script[src$="basket.full.min.js"]').remove();
      $('script[defer]').remove();
    });
  });

  it("load partial l10n and get string", function () {
    var l10n,
      dfd,
      flag, flag2;

    l10n = new L10N('ja');
    runs(function () {
      l10n.loadCommonDfd.done(function () {
        flag = true;
      });
    });

    waitsFor(function () {
      return flag;
    }, 'failed load common l10n', 3000);

    runs(function () {
      dfd = l10n.load('/spec/cards/foobar', 'foobar');
      dfd.done(function () {
        flag2 = true;
      });
    });

    waitsFor(function () {
      return flag2;
    }, 'failed load partial l10n', 3000);

    runs(function () {
      expect(l10n.foobar).toBeDefined();
      expect(l10n.foobar).not.toBeNull();
      expect(l10n.get('foobar', 'baz')).toEqual('pux');
    });
  });

  it("When user has already loaded partial l10n, imediately return deferred object", function () {
    var l10n,
      dfd, dfd2,
      flag, flag2, flag3;

    l10n = new L10N('ja');
    runs(function () {
      l10n.loadCommonDfd.done(function () {
        flag = true;
      });
    });

    waitsFor(function () {
      return flag;
    }, 'failed load common l10n', 3000);

    runs(function () {
      dfd = l10n.load('/spec/cards/foobar', 'foobar');
      dfd.done(function () {
        flag2 = true;
      });
    });

    waitsFor(function () {
      return flag2;
    }, 'failed load partial l10n', 3000);

    runs(function () {
      expect(l10n.foobar).toBeDefined();
      expect(l10n.foobar).not.toBeNull();
      expect(l10n.get('foobar', 'baz')).toEqual('pux');
      spyOn(window, 'require').andCallThrough();
      dfd2 = l10n.load('/spec/cards/foobar', 'foobar');
      dfd2.done(function () {
        flag3 = true;
      });
    });

    waitsFor(function () {
      return flag3;
    }, 'failed load partial l10n', 3000);

    runs(function () {
      expect(l10n.get('foobar', 'baz')).toEqual('pux');
      expect(window.require).not.toHaveBeenCalled();
    })
  });

  it("load parial l10n failed then return empy object", function () {
    var l10n,
      dfd,
      flag, flag2;

    l10n = new L10N('ja');
    runs(function () {
      l10n.loadCommonDfd.done(function () {
        flag = true;
      });
    });

    waitsFor(function () {
      return flag;
    }, 'failed load common l10n', 3000);

    runs(function () {
      dfd = l10n.load('/spec/cards/notfound', 'foobar');
      dfd.done(function () {
        flag2 = true;
      });
    });

    waitsFor(function () {
      return flag2;
    }, 'failed load partial l10n', 3000);

    runs(function () {
      expect(l10n.foobar).toBeDefined();
      expect(l10n.foobar).not.toBeNull();
      expect(l10n.foobar).toEqual({});
    });
  });

  it("waitLoadCommon without this.loadCommonDfd", function () {
    // this condition doesn't occur in usual process
    // because this.loadCommonDfd generated in the initialize step,
    // which is for the sorts of safety net.
    var l10n,
      flag, flag2;

    l10n = new L10N('ja');
    runs(function () {
      l10n.loadCommonDfd.done(function () {
        flag = true;
      });
    });

    waitsFor(function () {
      return flag;
    }, 'failed load common l10n', 3000);

    runs(function () {
      delete l10n.common;
      delete l10n.loadCommonDfd;
      l10n.waitLoadCommon(function () {
        flag2 = true;
      });
    });

    waitsFor(function () {
      return flag2;
    }, 'failed load common l10n in called waitLoadCommon method', 3000);

    runs(function () {
      expect(l10n.common).toBeDefined();
      expect(l10n.common).not.toBeNull();
      expect(l10n.get('common', 'foo')).toEqual('bar');
    });
  });

  it("load ja strings", function () {
    var l10n, flag;

    require.undef('json!l10n/ja.json');
    define('json!l10n/ja.json', function () {
      return {
        "hello": "こんにちは"
      };
    });

    l10n = new L10N('ja');
    runs(function () {
      l10n.loadCommonDfd.done(function () {
        flag = true;
      });
    });

    waitsFor(function () {
      return flag;
    }, 'failed load common l10n', 3000);

    runs(function () {
      expect(l10n.common).toBeDefined();
      expect(l10n.common).not.toBeNull();
      expect(l10n.get('common', 'hello')).toEqual('こんにちは');
    });
  });

  it("load de strings", function () {
    var l10n, flag;

    require.undef('json!l10n/de.json');
    define('json!l10n/de.json', function () {
      return {
        "hello": "hallo"
      };
    });

    l10n = new L10N('de');
    runs(function () {
      l10n.loadCommonDfd.done(function () {
        flag = true;
      });
    });

    waitsFor(function () {
      return flag;
    }, 'failed load common l10n', 3000);

    runs(function () {
      expect(l10n.common).toBeDefined();
      expect(l10n.common).not.toBeNull();
      expect(l10n.get('common', 'hello')).toEqual('hallo');
    });
  });


  it("load fr strings", function () {
    var l10n, flag;

    require.undef('json!l10n/fr.json');
    define('json!l10n/fr.json', function () {
      return {
        "hello": "bonjour"
      };
    });

    l10n = new L10N('fr');
    runs(function () {
      l10n.loadCommonDfd.done(function () {
        flag = true;
      });
    });

    waitsFor(function () {
      return flag;
    }, 'failed load common l10n', 3000);

    runs(function () {
      expect(l10n.common).toBeDefined();
      expect(l10n.common).not.toBeNull();
      expect(l10n.get('common', 'hello')).toEqual('bonjour');
    });
  });

  it("load nl strings", function () {
    var l10n, flag;

    require.undef('json!l10n/nl.json');
    define('json!l10n/nl.json', function () {
      return {
        "hello": "hallo"
      };
    });

    l10n = new L10N('nl');
    runs(function () {
      l10n.loadCommonDfd.done(function () {
        flag = true;
      });
    });

    waitsFor(function () {
      return flag;
    }, 'failed load common l10n', 3000);

    runs(function () {
      expect(l10n.common).toBeDefined();
      expect(l10n.common).not.toBeNull();
      expect(l10n.get('common', 'hello')).toEqual('hallo');
    });
  });

  it("load es strings", function () {
    var l10n, flag;

    require.undef('json!l10n/es.json');
    define('json!l10n/es.json', function () {
      return {
        "hello": "¡hola"
      };
    });

    l10n = new L10N('es');
    runs(function () {
      l10n.loadCommonDfd.done(function () {
        flag = true;
      });
    });

    waitsFor(function () {
      return flag;
    }, 'failed load common l10n', 3000);

    runs(function () {
      expect(l10n.common).toBeDefined();
      expect(l10n.common).not.toBeNull();
      expect(l10n.get('common', 'hello')).toEqual('¡hola');
    });
  });

  it("When user language is undefined, load en-us as a default", function () {
    var l10n, flag;

    require.undef('json!l10n/en-us.json');
    define('json!l10n/en-us.json', function () {
      return {
        "foo": "bar"
      };
    });

    l10n = new L10N();
    runs(function () {
      l10n.loadCommonDfd.done(function () {
        flag = true;
      });
    });

    waitsFor(function () {
      return flag;
    }, 'failed load common l10n', 3000);

    runs(function () {
      expect(l10n.common).toBeDefined();
      expect(l10n.common).not.toBeNull();
      expect(l10n.get('common', 'foo')).toEqual('bar');
    });
  });

  it("When user language is unknown one in Loupe, load en-us as a fallback", function () {
    var l10n, flag;

    require.undef('json!l10n/en-us.json');
    define('json!l10n/en-us.json', function () {
      return {
        "foo": "bar"
      };
    });

    l10n = new L10N('unknownLanguage');
    runs(function () {
      l10n.loadCommonDfd.done(function () {
        flag = true;
      });
    });

    waitsFor(function () {
      return flag;
    }, 'failed load common l10n', 3000);

    runs(function () {
      expect(l10n.common).toBeDefined();
      expect(l10n.common).not.toBeNull();
      expect(l10n.get('common', 'foo')).toEqual('bar');
    });
  });

  afterEach(function () {
    $('#main-script').remove();
  });
});
