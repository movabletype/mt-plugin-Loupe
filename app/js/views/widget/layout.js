define(['backbone.marionette', 'backbone.marionette.handlebars', 'hbs!js/views/widget/templates/layout'],

function (Marionette, MarionetteHandlebars, template) {
  "use strict";

  return Marionette.Layout.extend({
    initialize: function (options) {
      this.widget = options.widget;
    },

    template: {
      type: 'handlebars',
      template: template
    },

    regions: {
      header: '#header',
      main: '#main',
      footer: '#footer'
    },

    onRender: function () {
      this.$el.addClass('container');
      var that = this;
      var id = this.widget.id;
      var path = 'widgets/' + id + '/';

      if (this.widget.viewView) {
        require([path + that.widget.viewView.replace(/\.js$/, '')], function (View) {
          console.log('foobar');
          console.log(that.main);
          that.main.show(new View());
        });
      } else {
        var match = this.widget.viewTemplate.match(/^(.*)\.(.*)$/);
        var type, filename;
        if (match[2] === 'hbs') {
          type = 'hbs';
          filename = match[1];
        } else {
          type = 'text';
          filename = match[0];
        }
        var script = this.widget.viewData ? [path + this.widget.viewData.replace(/\.js$/, '')] : [];
        var requirements = [type + '!' + path + filename].concat(script);

        require(requirements, function (template, data) {
          if (type === 'hbs') {
            template = template(data);
          } else {
            template = _.template(template, data);
          }
          var View = Marionette.ItemView.extend({
            template: template
          });
          that.main.show(new View());
        });
      }
    }
  });
});