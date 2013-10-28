/**
 * @typedef {object} card
 * @property {!string} id
 * @property {dashboard=} dashboard settings for dashboard, If there is no dashboard setting, this card is not appeared in dashbaord (which doesn't mean not load the card).
 * @property {(Array.<route>)=} routes array of route settings for detailed views.
 */

/**
 * @typedef {object} dashboard
 * @property {number=} order Dashboard inserts the cards in ascending order using this number. In default, stored card appending the last.
 * @property {string=} view path to the requireJS module to render the dashboard card
 * @property {string=} template path to the template file to render. This setting is only used when you don't use requireJS module for builiding dashboard card
 * @property {string=} data path to the data file used in template file. This setting is only used when you don't use requireJS module for builiding dashboard card
 */

/**
 * @typedef {object} route
 * @property {!string} id used inside router for identifing what method to call in its route.
 * @property {string} route set URL to the view. URL must be relative to Loupe's home(dashboard) screen. You can contain parameter parts provied by Backbone.Router
 * @property {view=} view path to the requireJS module to render the detailed view
 * @property {header=} header path to the requireJS module to render the detailed view's header. If no settting, use the common header view module in Loupe
 * @property {string=} template path to the template file to render the detailed view. This setting is only used when you don't use requireJS module for builiding view
 * @property {string=} data path to the data file used in template file. This setting is only used when you don't use requireJS module for builiding view
 */

define(function () {
  var _cards = [],
    _dfds = [],
    /**
     * A module to manipulate cards stored in app as private
     * @exports js/cards
     */
    cardsMethods = {
      /**
       * add card to stored cards array. If passing card's id is already contained in the stored cards array, ignore it.
       * @param {card} card
       * @param {boolean} silence set true if you don't want to trigger cards:add event after adding card (Loupe listens cards:add event and deploy addional cards automatically)
       * @return {object} return itself for chaining
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
      /**
       * deploy cards to set routes into router and insert dashboard
       * @return {object} jQuery Deferred object which is resolved when all cards are dployed
       */
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
          if (card.id && !card.deployed && !card.dfd) {
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
            dfd.resolve();
          });
        }

        return dfd;
      },
      /**
       * get all cards information
       * @return {Array.<card>} array of each cloned card (not deep clone)
       */
      getAll: function () {
        return _.map(_cards, function (card) {
          return _.clone(card);
        });
      },
      /**
       * clear stored cards in app
       * It's important to note that this method does not remove routers routes added with deploy method.
       */
      clearAll: function () {
        _cards = [];
        _dfds = [];
      }
    };
  return cardsMethods;
});
