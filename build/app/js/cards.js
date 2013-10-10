define(['js/commands'], function (commands) {
  /**
   * @typeof {Object} Card
   * @property {!String} id
   */

  var cards = [],
    cardsMethods = {
      /**
       * add card to cards array. When same id is already in cards array, ignore it.
       * @param {Card} card
       */
      add: function (card) {
        var dfd = $.Deferred();

        function addCardRoute(card, i, len) {
          if (i === len) {
            dfd.resolve();
          } else {
            var route = card.routes[i];
            commands.execute('addCardViewMethod', card, route, function () {
              commands.execute('router:addRoute', card, route, function () {
                commands.execute('app:setCardViewHandler', card, route, function () {
                  addCardRoute(card, i + 1, len);
                });
              });
            });
          }
        }

        if (card.id && !_.find(cards, function (orig) {
          return orig.id === card.id;
        })) {
          cards.push(card);
          var len = card.routes ? card.routes.length : 0;
          addCardRoute(card, 0, len);
        } else {
          dfd.resolve();
        }
        return dfd;
      },
      /**
       * get all cards information
       * @return {Array.<Card>} cards array of cards
       */
      getAll: function () {
        return cards;
      }
    };
  return cardsMethods;
});
