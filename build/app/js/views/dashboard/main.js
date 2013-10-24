define(['backbone.marionette', 'js/commands', 'js/cards', 'js/trans', 'js/mtapi/blog', 'js/views/card/itemview', 'hbs!js/views/dashboard/templates/main'],

  function (Marionette, commands, cardsMethod, Trans, getBlog, CardItemView, template) {
    "use strict";

    return Marionette.Layout.extend({
      serializeData: function () {
        var data = {};
        data.error = this.error;
        data.trans = this.trans;
        return data;
      },

      template: template,

      insertCard: function (card) {
        if (card.dashboard) {
          var id = card.id,
            idAttr = 'card-' + id,
            order = parseFloat(card.dashboard.order, 10) || null;

          card.$el = $('<section id="' + idAttr + '" class="card"></section>');
          card.$el.selector = '#' + idAttr;

          if (typeof order !== 'number') {
            card.$el.appendTo(this.$el);
            card.inserted = true;
          } else {
            var len = this.cards.length;

            var sortedCards = _.sortBy(this.cards, function (card) {
              return card.dashboard ? (parseFloat(card.dashboard.order, 10) || 10e18) : 10e18;
            });

            for (var i = 0; i < len; i++) {
              var target = sortedCards[i],
                targetOrder = target.dashboard ? (parseFloat(target.dashboard.order, 10) || null) : null,
                $targetEl = target.$el;

              if (target.inserted && target.id !== card.id && (!targetOrder || targetOrder > order)) {
                card.$el.insertBefore($targetEl);
                card.inserted = true;
                break;
              }
            }
            if (!card.inserted) {
              card.$el.appendTo(this.$el);
              card.inserted = true;
            }
          }

          this[id + 'Handler'] = this.createHandler(card);

          this.on('region:add', function (name, region) {
            this[name + 'Handler'](name, region);
          }, this);

          this.addRegion(id, card.$el);
        }
      },

      createHandler: function (card) {
        return function (name, region) {
          var id = card.id,
            dashboard = card.dashboard,
            path = (card.root || 'cards/') + id + '/';

          if (DEBUG) {
            var dfd = $.Deferred();
            this.cardsDfds.push(dfd);
            region.on('show', function () {
              require(['perf'], function (perf) {
                perf.log('afterCardBuild_' + id);
                dfd.resolve();
              });
            });
          }

          if (dashboard.view) {
            require([path + dashboard.view.replace(/\.js$/, '')], _.bind(function (View) {
              region.show(new View(_.extend(this.options, {
                card: card
              })));
            }, this));
          } else if (dashboard.template) {
            var match = dashboard.template.match(/^(.*)\.(.*)$/),
              type, filename;

            if (match[2] === 'hbs') {
              type = 'hbs';
              filename = match[1];
            } else {
              type = 'text';
              filename = match[0];
            }

            var script = dashboard.data ? [path + dashboard.data.replace(/\.js$/, '')] : [],
              templatePath = type + '!' + path + filename,
              requirements = [templatePath].concat(script);

            require(requirements, _.bind(function (template, templateData) {
              template = type === 'hbs' ? template : templatePath;
              templateData = templateData ? templateData : {};
              var View = CardItemView.extend({
                template: template,
                serializeData: function () {
                  var data = this.serializeDataInitialize();
                  data = _.extend(data, templateData);
                  return data;
                }
              });

              region.show(new View(_.extend(this.options, {
                card: card
              })));
            }, this));
          }
        };
      },

      onClose: function () {
        commands.removeHandler('dashboard:insertCard');
      },

      prepareCards: function (options) {
        if (options.user) {
          commands.execute('l10n', _.bind(function (l10n) {
            this.trans = new Trans(l10n);
            this.cardsDfds = [];
            if (this.cards && this.cards.length) {
              _.each(this.cards, function (card) {
                this.insertCard(card);
              }, this);
            } else {
              this.render();
            }

            if (DEBUG) {
              $.when.apply($, this.cardsDfds).done(function () {
                require(['perf'], function (perf) {
                  perf.log('afterAllCardsLoaded');
                  perf.info('afterAllCardsLoaded');
                  console.log(perf);
                });
              });
            }
          }, this));
        } else {
          this.trans = new Trans();
          this.render();
        }
      },

      initialize: function (options) {
        this.options = options;
        this.blog = options.blog;
        if (this.blog) {
          this.error = this.blog.error;
        }
        this.cards = (this.error || !options.cards) ? [] : options.cards;
      },

      setHandler: function () {
        commands.setHandler('dashboard:insertCard', function (addedCards) {
          addedCards = $.isArray(addedCards) ? addedCards : (addedCards ? [addedCards] : []);
          _.each(addedCards, function (card) {
            if (!_.find(this.cards, function (c) {
              return c.id === card.id;
            })) {
              this.cards.push(card);
              this.insertCard(card);
            }
          }, this);
        }, this);
      },

      onRender: function () {
        if (!this.buildOnlyOnce) {
          this.buildOnlyOnce = true;
          this.prepareCards(this.options);
          this.setHandler();
        }
      }
    });
  });
