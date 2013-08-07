describe("views", function () {
	'use strict';

	var headerRenderFlag;
	var controller;
	var commandSpy;

	beforeEach(function () {
		var commandsOrig = require('js/commands');
		var command = _.clone(commandsOrig);
		commandSpy = jasmine.createSpy('commandSpy');
		command.execute = function (co, data) {
			commandSpy(co, data);
			if (co === 'l10n') {
				controller.l10n.waitLoadCommon(data);
			} else if (co === 'header:render') {
				commandsOrig.execute.call(commandsOrig, co, data);
				headerRenderFlag = true;
			} else {
				commandsOrig.execute.call(commandsOrig, co, data);
			}
		};

		undefRequireModule('js/commands');
		define('js/commands', [], function () {
			return command;
		});

		reRequireModule('js/views/card/itemview');

		runs(function () {
			reRequireModule('js/views/card/header');
			reRequireModule('js/router/controller');
		});
	});


	describe("card/header", function () {
		var Controller, ItemView, itemView;
		var cards = [{
			"name": "ItemView",
			"id": "itemview",
			"dashboard": {
				"view": "dashboard/dashboard"
			},
			"routes": [{
				"id": "view",
				"view": "view/layout"
			}, {
				"id": "post",
				"route": ":blog_id/:id/:unit",
				"view": "view/post",
				"header": "view/post_header"
			}]
		}];

		var flag, initData;
		Controller = require('js/router/controller');
		controller = new Controller({
			cards: cards
		});
		controller.auth(function (data) {
			ItemView = require('js/views/card/itemview');
			initData = _.extend({}, data, {
				card: cards[0]
			});
			itemView = new ItemView(data);
			flag = true;
		});

		waitsFor(function () {
			return flag;
		}, 'controller authentication', 3000);

		beforeEach(function () {
			headerRenderFlag = null;
		});

		it("header:render handler", function () {
			var Header = require('js/views/card/header');
			var header = new Header(initData);
			spyOn(header, 'render');
			var commands = require('js/commands');
			commands.execute('header:render', {
				foo: 'bar'
			});
			waitsFor(function () {
				return headerRenderFlag
			}, 'command recieving', 3000);
			runs(function () {
				expect(header.object).toBeDefined();
				expect(header.object.foo).toEqual('bar')
				expect(header.render).toHaveBeenCalled();
			})
		});

		it("handle back button", function () {
			var Header = require('js/views/card/header');
			var header = new Header(initData);
			var flag;
			header.$el.appendTo($('#main'));

			spyOn(header, 'backButtonRoute').andCallThrough();
			var origFunc = header.handleBackButton;
			spyOn(header, 'handleBackButton').andCallFake(function () {
				origFunc.apply(header, arguments);
				setTimeout(function () {
					flag = true;
				}, 500);
			});

			header.ui.backDashboardButton.trigger('tap');

			waitsFor(function () {
				return flag;
			}, 'tap handling', 3000);

			runs(function () {
				expect(header.backButtonRoute).toHaveBeenCalled();
				expect(header.handleBackButton).toHaveBeenCalled();
				var args = commandSpy.mostRecentCall.args;
				expect(args[0]).toEqual('router:navigate');
				expect(args[1]).toEqual('');
				header.$el.remove();
			})
		});

		it("handle share button", function () {
			var Header = require('js/views/card/header');
			var header = new(Header.extend({
				serializeData: function () {
					var data = Header.prototype.serializeData.apply(this, arguments);
					data.shareEnabled = true;
					return data
				}
			}))(initData);

			var flag, flag0;
			header.$el.appendTo($('#main'));

			var origFunc = header.addTapClass;
			spyOn(header, 'addTapClass').andCallFake(function () {
				origFunc.apply(header, arguments);
				setTimeout(function () {
					flag = true;
				}, 500);
			});

			header.ui.shareButton.trigger('tap');

			waitsFor(function () {
				return flag;
			}, 'tap handling', 5000);

			runs(function () {
				var args = commandSpy.mostRecentCall.args;
				expect(args[0]).toEqual('card:itemview:share:show');
				expect(args[1]).toEqual('');
				header.$el.remove();
			})
		})
	});

	afterEach(function () {
		require.undef('js/commands');
		requireModuleAndWait('js/commands');
	})
});
