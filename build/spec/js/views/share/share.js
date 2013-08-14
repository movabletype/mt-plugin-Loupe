describe("views", function () {
  'use strict';

  var Share, share;
  var Controller, controller, initData;
  var commandSpies;

  beforeEach(function () {
    commandSpies = jasmine.createSpyObj('commandSpies', ['share:close']);
    initCommands(commandSpies, controller);

    runs(function () {
      reRequireModule(['js/router/controller', 'js/views/share/share']);
    })

    runs(function () {
      initController(Controller, controller, function (data) {
        initData = data;
        console.log(initData)
        Share = require('js/views/share/share');
      });
    });

    waitsFor(function () {
      return !!initData;
    }, 'initialize main', 3000);
  });

  describe("share/share", function () {
    it("initialize without share option", function () {
      share = new Share();
      spyOn(share, 'render').andCallThrough();
      spyOn(share, 'onRender').andCallThrough();

      waitsFor(function () {
        return !!share.trans;
      }, 'executed l10n', 3000);

      runs(function () {
        expect(share.render).toHaveBeenCalled();
        expect(share.onRender).toHaveBeenCalled();
        expect(share.share).toEqual({});
      });
    });

    it("serializeData with tweet data", function () {
      var options = {
        share: {
          url: 'http://memolog.org/',
          tweetText: 'foobar'
        }
      }
      share = new Share(options);

      waitsFor(function () {
        return !!share.trans;
      }, 'executed l10n', 3000);

      runs(function () {
        var data = share.serializeData();
        expect(data.tweetUrl).toEqual(options.share.url);
        expect(data.tweetText).toEqual(options.share.tweetText);
      });
    });

    it("trancate tweet data when over 140 characters removing html", function () {
      var options = {
        share: {
          url: 'http://memolog.org/',
          tweetText: '<p>これは当時要するにどんな中止人としてののところのいですです。</p><p>ともかく時間より観念共もひとまずそういう説明ありですくらいにできるてならないをは講演するなましば、とてもにもするななけれなな。学校にしたのはつい今朝で多分ううで。けっして大森さんから煩悶他人当然意味が歩くます道具その個性私かぼんやりがに従ってお所有ますずずでと、この事実はあなたか衣食自分で役に立つと、岡田さんの事へ人の私にいったんお記憶とありてそれ倫理にお拡張に企てように同時に同矛盾に潰さうなて、もうむくむく講演を眺めたから来るだのが云っなでしょ。ただだから小同年輩がみものは当然大変と考えないば、その地位がは引張っでてについて先生を至ると行くだな。</p>'
        }
      }
      share = new Share(options);

      waitsFor(function () {
        return !!share.trans;
      }, 'executed l10n', 3000);

      runs(function () {
        var data = share.serializeData();
        expect(data.tweetUrl).toEqual(options.share.url);
        expect(data.tweetText).toEqual('これは当時要するにどんな中止人としてののところのいですです。ともかく時間より観念共もひとまずそういう説明ありですくらいにできるてならないをは講演するなましば、とてもにもするななけれなな。学校にしたのはつい今朝で多分ううで。けっして大森...');
      });
    });

    it("share modal close", function () {
      share = new Share();
      spyOn(share, 'onRender').andCallThrough();

      waitsFor(function () {
        return !!share.onRender.callCount;
      }, 'onRender', 3000);

      runs(function () {
        var $close = share.$el.find('#share-close');
        $close.trigger('tap');
      });

      waitsFor(function () {
        return !!commandSpies['share:close'].callCount;
      }, 'executed command spy', 3000);

      runs(function () {
        expect(commandSpies['share:close']).toHaveBeenCalled();
      })
    });
  });

  afterEach(function () {
    reRequireModule(['js/commands', 'js/router/controller']);
  });
});
