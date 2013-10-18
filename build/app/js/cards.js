define(function () {
  /**
   * @typeof {Object} Card
   * @property {!String} id
   */

  var _cards = [],
    _dfds = [],
    cardsMethods = {
      /**
       * add card to cards array. When same id is already in cards array, ignore it.
       * @param {Card} card
       */
      add: function (cards, silence) {
        cards = Object.prototype.toString.call(cards) === '[object Array]' ? cards : (typeof cards !== 'undefined' ? [cards] : []);

        var len = cards.length,
          addedCards = [],
          orig, card;

        for (var i = 0; i < len; i++) {
          orig = cards[i];
          var l = _cards.length;
          var flag = false;

          for (var j = 0; j < l; j++) {
            if (_cards[j].id === orig.id) {
              flag = true;
              break;
            }
          }

          if (!flag) {
            card = {};
            for (var c in orig) {
              card[c] = orig[c];
            }
            card.deployed = false;
            _cards.push(card);
            addedCards.push(card);
          }
        }

        /*global Backbone:false*/
        if (!silence && typeof Backbone !== 'undefined' && Backbone.Wreqr) {
          require(['js/vent'], function (vent) {
            vent.trigger('cards:add', addedCards);
          });
        }

        return this;
      },
      deploy: function () {
        var dfd = $.Deferred();

        function addCardRoute(card, i, len) {
          if (i === len) {
            card.deployed = true;
            card.dfd.resolve();
          } else {
            var route = card.routes[i];
            require(['js/commands'], function (commands) {
              commands.execute('router:addRoute', card, route, function () {
                commands.execute('app:setCardViewHandler', card, route, function () {
                  addCardRoute(card, i + 1, len);
                });
              });
            });
          }
        }

        _.each(_cards, function (card) {
          if (card.id && !card.deployed) {
            card.dfd = $.Deferred();
            _dfds.push(card.dfd);
            var len = card.routes ? card.routes.length : 0;
            addCardRoute(card, 0, len);
          }
        });

        if (_dfds.length === 0) {
          dfd.resolve();
        } else {
          $.when.apply($, _dfds).done(function () {
            _dfds = [];
            dfd.resolve();
          });
        }

        return dfd;
      },
      /**
       * get all cards information
       * @return {Array.<Card>} cards array of cards
       */
      getAll: function () {
        return _.map(_cards, function (card) {
          return _.clone(card);
        });
      },
      clearAll: function () {
        _cards = [];
        _dfds = [];
      }
    };
  return cardsMethods;
});
