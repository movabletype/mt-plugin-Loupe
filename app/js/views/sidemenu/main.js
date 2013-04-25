define(['backbone.marionette','backbone.marionette.handlebars','hbs!js/views/sidemenu/templates/main'], function (Marionette,MarionetteHandlebars,template) {
  "use strict";

  return Marionette.ItemView.extend({
    template : {
      type: 'handlebars',
      template: template
    }
  });
});
