define('cards/test/dashboard', ['backbone.marionette', 'backbone.marionette.handlebars', 'hbs!cards/test/templates/dashboard'], function (Marionette, MarionetteHandlebars, template) {
  "use strict";

  return Marionette.ItemView.extend({
    template: {
      type: 'handlebars',
      template: template
    }
  });
});

define('cards/test/view', ['backbone.marionette', 'backbone.marionette.handlebars', 'hbs!cards/test/templates/view'], function (Marionette, MarionetteHandlebars, template) {
  "use strict";

  return Marionette.ItemView.extend({
    template: {
      type: 'handlebars',
      template: template
    }
  });
});

define('hbs!cards/test/templates/dashboard', ['hbs', 'handlebars'], function (hbs, Handlebars) {
  var t = Handlebars.template(function (Handlebars, depth0, helpers, partials, data) {
    helpers = helpers || Handlebars.helpers;
    return "<strong>HELLOW WORLD</strong>";
  });
  Handlebars.registerPartial('cards_test_templates_dashboard', t);
  return t;
});

define('hbs!cards/test/templates/view', ['hbs', 'handlebars'], function (hbs, Handlebars) {
  var t = Handlebars.template(function (Handlebars, depth0, helpers, partials, data) {
    helpers = helpers || Handlebars.helpers;
    return "<strong>HELLOW WORLD</strong>";
  });
  Handlebars.registerPartial('cards_test_templates_view', t);
  return t;
});
