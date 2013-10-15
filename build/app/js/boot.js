require(['backbone', 'backbone.marionette', 'app', 'json!cards/cards.json'], function (Backbone, Marionette, app, cardsJSON) {
  // override for AMD
  Marionette.TemplateCache.prototype.loadTemplate = function (templateId) {
    return require(templateId);
  };

  app.start({
    cards: cardsJSON
  });
});
