define(['backbone.marionette', 'backbone.marionette.handlebars', 'widgets/acception/model', 'hbs!widgets/acception/templates/view'], function (Marionette, MarionetteHandlebars, Model, template) {
  "use strict";

  return Marionette.ItemView.extend({
    template: function (model) {
      return template(model);
    },
    model: new Model(),
    initialize: function (params) {
      this.blogId = params.params[0];
      this.entryId = params.params[1];
      this.model.fetch({
        blogId: this.blogId,
        entryId: this.entryId
      });
      this.listenTo(this.model, 'sync', this.render)
    }
  });
});