describe("trans", function () {
  'use strict';

  var Trans = require('js/trans');
  var L10N = require('js/l10n');

  require.undef('json!l10n/ja.json');
  define('json!l10n/ja.json', function () {
    return {
      "hello": "こんにちは"
    };
  });

  it('translate string to ja', function () {
    var l10n = new L10N('ja'),
      dfd,
      flag, flag2;

    runs(function () {
      l10n.loadCommonDfd.done(function () {
        flag = true;
      });
    });

    waitsFor(function () {
      return flag;
    }, 'failed load common l10n', 3000);

    runs(function () {
      dfd = l10n.load('/spec/cards/trans', 'trans');
      dfd.done(function () {
        flag2 = true;
      });
    });

    waitsFor(function () {
      return flag2;
    }, 'failed load partial l10n', 3000);

    runs(function () {
      var trans = new Trans(l10n, 'trans');
      var str = 'Six Aapart';
      var expectedStr = 'シックスアパート';
      var translatedStr = trans.trans(str);
      expect(translatedStr).toEqual(expectedStr);
    });
  });

  it('when translated string is not in the partial l10n, use common l10n string', function () {
    var l10n = new L10N('ja'),
      dfd,
      flag, flag2;

    runs(function () {
      l10n.loadCommonDfd.done(function () {
        flag = true;
      });
    });

    waitsFor(function () {
      return flag;
    }, 'failed load common l10n', 3000);

    runs(function () {
      dfd = l10n.load('/spec/cards/trans', 'trans');
      dfd.done(function () {
        flag2 = true;
      });
    });

    waitsFor(function () {
      return flag2;
    }, 'failed load partial l10n', 3000);

    runs(function () {
      var trans = new Trans(l10n, 'trans');
      var str = 'hello';
      var expectedStr = 'こんにちは';
      var translatedStr = trans.trans(str);
      expect(translatedStr).toEqual(expectedStr);
    });
  });

  it('When translated string is not in neigher partial nor common l10n, just return thrown string', function () {
    var l10n = new L10N('ja'),
      dfd,
      flag, flag2;

    runs(function () {
      l10n.loadCommonDfd.done(function () {
        flag = true;
      });
    });

    waitsFor(function () {
      return flag;
    }, 'failed load common l10n', 3000);

    runs(function () {
      dfd = l10n.load('/spec/cards/trans', 'trans');
      dfd.done(function () {
        flag2 = true;
      });
    });

    waitsFor(function () {
      return flag2;
    }, 'failed load partial l10n', 3000);

    runs(function () {
      var trans = new Trans(l10n, 'trans');
      var str = 'This is the string which has no translation string';
      var translatedStr = trans.trans(str);
      expect(translatedStr).toEqual(str);
    });
  });

  it('when l10n object is null, just return the thrown string', function () {
    var trans = new Trans();
    var str = 'hello';
    var translatedStr = trans.trans(str);
    expect(translatedStr).toEqual(str);
  });

  it('translate string with one paramater', function () {
    var l10n = new L10N('ja'),
      dfd,
      flag, flag2;

    runs(function () {
      l10n.loadCommonDfd.done(function () {
        flag = true;
      });
    });

    waitsFor(function () {
      return flag;
    }, 'failed load common l10n', 3000);

    runs(function () {
      dfd = l10n.load('/spec/cards/trans', 'trans');
      dfd.done(function () {
        flag2 = true;
      });
    });

    waitsFor(function () {
      return flag2;
    }, 'failed load partial l10n', 3000);

    runs(function () {
      var trans = new Trans(l10n, 'trans');
      var str = 'hello [_1]';
      var param1 = '山口'
      var expectedStr = 'こんにちは山口さん';
      var translatedStr = trans.trans(str, param1);
      expect(translatedStr).toEqual(expectedStr);
    });
  });

  it('translate string with two paramater', function () {
    var l10n = new L10N('ja'),
      dfd,
      flag, flag2;

    runs(function () {
      l10n.loadCommonDfd.done(function () {
        flag = true;
      });
    });

    waitsFor(function () {
      return flag;
    }, 'failed load common l10n', 3000);

    runs(function () {
      dfd = l10n.load('/spec/cards/trans', 'trans');
      dfd.done(function () {
        flag2 = true;
      });
    });

    waitsFor(function () {
      return flag2;
    }, 'failed load partial l10n', 3000);

    runs(function () {
      var trans = new Trans(l10n, 'trans');
      var str = 'This is a [_1], and that is a [_2]';
      var param1 = 'ペン';
      var param2 = '机'
      var expectedStr = 'これはペンであれは机';
      var translatedStr = trans.trans(str, param1, param2);
      expect(translatedStr).toEqual(expectedStr);
    });
  });

  it('translate string with two paramater with different order', function () {
    var l10n = new L10N('ja'),
      dfd,
      flag, flag2;

    runs(function () {
      l10n.loadCommonDfd.done(function () {
        flag = true;
      });
    });

    waitsFor(function () {
      return flag;
    }, 'failed load common l10n', 3000);

    runs(function () {
      dfd = l10n.load('/spec/cards/trans', 'trans');
      dfd.done(function () {
        flag2 = true;
      });
    });

    waitsFor(function () {
      return flag2;
    }, 'failed load partial l10n', 3000);

    runs(function () {
      var trans = new Trans(l10n, 'trans');
      var str = '[_1] in [_2]';
      var param1 = '猫';
      var param2 = '箱'
      var expectedStr = '箱に入った猫';
      var translatedStr = trans.trans(str, param1, param2);
      expect(translatedStr).toEqual(expectedStr);
    });
  });

  it('translate string with quant (singular)', function () {
    var l10n = new L10N('es'),
      dfd,
      flag, flag2;

    runs(function () {
      l10n.loadCommonDfd.done(function () {
        flag = true;
      });
    });

    waitsFor(function () {
      return flag;
    }, 'failed load common l10n', 3000);

    runs(function () {
      dfd = l10n.load('/spec/cards/trans', 'trans');
      dfd.done(function () {
        flag2 = true;
      });
    });

    waitsFor(function () {
      return flag2;
    }, 'failed load partial l10n', 3000);

    runs(function () {
      var trans = new Trans(l10n, 'trans');
      var str = '[quant,_1,hour,hours] from now';
      var param1 = 1;
      var param2 = 'hora';
      var param3 = 'horas'
      var expectedStr = 'hace 1 hora';
      var translatedStr = trans.trans(str, param1, param2);
      expect(translatedStr).toEqual(expectedStr);
    });
  });

  it('translate string with quant (plural)', function () {
    var l10n = new L10N('es'),
      dfd,
      flag, flag2;

    runs(function () {
      l10n.loadCommonDfd.done(function () {
        flag = true;
      });
    });

    waitsFor(function () {
      return flag;
    }, 'failed load common l10n', 3000);

    runs(function () {
      dfd = l10n.load('/spec/cards/trans', 'trans');
      dfd.done(function () {
        flag2 = true;
      });
    });

    waitsFor(function () {
      return flag2;
    }, 'failed load partial l10n', 3000);

    runs(function () {
      var trans = new Trans(l10n, 'trans');
      var str = '[quant,_1,hour,hours] from now';
      var param1 = 2;
      var expectedStr = 'hace 2 horas';
      var translatedStr = trans.trans(str, param1);
      expect(translatedStr).toEqual(expectedStr);
    });
  });


  it('translate string with quant (when plural word not declared, generate plural word by adding s)', function () {
    var l10n = new L10N('es'),
      dfd,
      flag, flag2;

    runs(function () {
      l10n.loadCommonDfd.done(function () {
        flag = true;
      });
    });

    waitsFor(function () {
      return flag;
    }, 'failed load common l10n', 3000);

    runs(function () {
      dfd = l10n.load('/spec/cards/trans', 'trans');
      dfd.done(function () {
        flag2 = true;
      });
    });

    waitsFor(function () {
      return flag2;
    }, 'failed load partial l10n', 3000);

    runs(function () {
      var trans = new Trans(l10n, 'trans');
      var str = 'set complete ([quant,_1,file] in [_2] seconds)';
      var param1 = 3;
      var param2 = 30;
      var expectedStr = 'conjunto completo (3 ficheros en 30 segundos)';
      var translatedStr = trans.trans(str, param1, param2);
      expect(translatedStr).toEqual(expectedStr);
    });
  });

  afterEach(function () {
    Backbone.history.navigate('');
  })
});
