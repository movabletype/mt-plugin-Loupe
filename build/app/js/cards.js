define([], function () {
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
        if (!_.find(cards, function (orig) {
          return orig.id === card.id;
        })) {
          cards.push[card];
          commands.execute('addCardViewMethod', card);
        }
      },
      /**
       * remove card from cards array.
       * @param  {Card} card
       */
      remove: function (card) {
        cards = _.reject(cards, function (orig) {
          return orig.id === card.id
        });
      },

    };
  return cardsMethods;
});
