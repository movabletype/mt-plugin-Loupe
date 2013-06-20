define(['backbone.marionette', 'js/commands', 'js/trans', 'js/mtapi/blog', 'hbs!js/views/dashboard/templates/main'],

function (Marionette, commands, Trans, getBlog, template) {
  "use strict";

  return Marionette.Layout.extend({
    serializeData: function () {
      var data = {};
      data.error = this.error;
      data.trans = this.trans;
      return data;
    },

    template: template,

    prepareCards: function (options) {
      if (options.blog) {
        this.error = options.blog.error;
      }
      this.cards = this.error ? [] : options.cards;
      commands.execute('l10n', _.bind(function (l10n) {
        this.trans = new Trans(l10n);
        var cardsDfds = [];
        _.forEach(this.cards, function (card) {
          var dashboard = card.dashboard;
          if (dashboard) {
            var id = card.id;
            $('<section id="card-' + id + '" class="card"></section>').appendTo(this.el);
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
            if (dashboard.view) {
              require([path + dashboard.view.replace(/\.js$/, '')], function (View) {
                that[id].show(new View(_.extend(that.options, {
                  card: card
                })));
              });
            } else if (dashboard.template) {
              var match = dashboard.template.match(/^(.*)\.(.*)$/);
              var type, filename;
              if (match[2] === 'hbs') {
                type = 'hbs';
                filename = match[1];
              } else {
                type = 'text';
                filename = match[0];
              }

              var script = dashboard.data ? [path + dashboard.data.replace(/\.js$/, '')] : [];
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

                that[id].show(new View(_.extend(that.options, {
                  card: card
                })));
              });
            }
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
      }, this));
    },

    initialize: function (options) {
      this.options = options;
      this.blog = options.blog;
    },

    onRender: function () {
      if (!this.buildOnlyOnce) {
        this.buildOnlyOnce = true;
        this.prepareCards(this.options)
      }
    }
  });
});
