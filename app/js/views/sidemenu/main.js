define(['backbone.marionette', 'hbs!js/views/sidemenu/templates/main'], function (Marionette, template) {
  "use strict";

  return Marionette.ItemView.extend({
    template: function (data) {
      return template(data);
    }
  });
});