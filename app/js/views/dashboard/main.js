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

    template: function (data) {
      return template(data);
    },

    prepareCards: function (options) {
      if (options.blog) {
        this.error = options.blog.error;
      } else {
        this.error = {
          code: 404,
          message: 'Please select any site from the above menu'
        };
      }
      this.cards = this.error ? [] : options.cards;
      commands.execute('l10n', _.bind(function (l10n) {
        this.trans = new Trans(l10n);
        this.render();
      }, this));
    },

    initialize: function (options) {
      if (options.refetch) {
        this.blog = getBlog(options.blogId);
        this.blog.fail(_.bind(function (resp) {
          options.blog = {
            error: resp.error
          };
          $('#app-building').remove();
          this.prepareCards(options);
        }, this));

        this.blog.done(_.bind(function (blog) {
          options.blog = blog;
          $('#app-building').remove();
          this.prepareCards(options);
        }, this));
      } else {
        this.prepareCards(options);
      }
    },

    onRender: function () {
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
    }
  });
});
