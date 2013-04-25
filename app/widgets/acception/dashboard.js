define(['backbone.marionette', 'backbone.marionette.handlebars', 'hbs!widgets/acception/templates/dashboard'], function (Marionette, MarionetteHandlebars, template) {
  "use strict";

  return Marionette.ItemView.extend({
    template: {
      type: 'handlebars',
      template: template
    }
  });
});