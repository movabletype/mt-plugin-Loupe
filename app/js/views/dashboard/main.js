define(['backbone.marionette', 'js/commands', 'hbs!js/views/dashboard/templates/main'],

function (Marionette, commands, template) {
  "use strict";

  return Marionette.Layout.extend({
    serializeData: function () {
      return this.params.blog || {};
    },

    template: function (data) {
      return template(data);
    },

    initialize: function (options) {
      this.cards = options.cards;
      this.params = options.params;
    },

    onRender: function () {
      if (DEBUG) {
        var cardsDfds = [];
      }
      _.forEach(this.cards, function (card) {
        var id = card.id;
        $('<section id="card-' + id + '"></section>').appendTo(this.el);
        this.addRegion(id, "#card-" + id);
        var that = this;
        var path = 'cards/' + id + '/';

        if (DEBUG) {
          var dfd = $.Deferred();
          cardsDfds.push(dfd);
          that[id].on('show', function () {
            require(['perf'], function (perf) {
              perf.log('afterCardBuild_' + id);
              dfd.resolve();
            });
          });
        }
        if (card.dashboardView) {
          require([path + card.dashboardView.replace(/\.js$/, '')], function (View) {
            that[id].show(new View({
              params: that.params
            }));
          });
        } else {
          var match = card.dashboardTemplate.match(/^(.*)\.(.*)$/);
          var type, filename;
          if (match[2] === 'hbs') {
            type = 'hbs';
            filename = match[1];
          } else {
            type = 'text';
            filename = match[0];
          }

          var script = card.dashboardData ? [path + card.dashboardData.replace(/\.js$/, '')] : [];
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

            that[id].show(new View({
              params: that.params
            }));
          });
        }
      }, this);
      if (DEBUG) {
        $.when.apply(this, cardsDfds).done(function () {
          require(['perf'], function (perf) {
            perf.log('afterAllCardsLoaded');
            perf.info('afterAllCardsLoaded');
            console.log(perf);
          });
        });
      }
    }
  });
});
