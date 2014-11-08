/*
	
	ButterflyJS
	Ultimate JavaScript front-end library

	Version 1.0

	File: butterfly.js

	Developed by Semir Babajić

*/

var Butterfly = function(element, options) {
	this.element = element;
	this.$element = $(element);
	this.options = options || {};
};

(function($) {
	/**
	 * Internal helper and private functions
	 *
	 * @type {object}
	 */
	var _ = {
		/**
		 * Determines whether passed argument is null/undefined
		 *
		 * @param  {object} value Value to examine
		 *
		 * @return {boolean} True if passed value is null
		 */
		isNull: function(value) {
			return typeof value === 'undefined' || value === null;
		},

		/**
		 * Determines whether passed argument is not null/undefined
		 *
		 * @param  {object} value Value to examine
		 *
		 * @return {boolean} True if passed value is not null
		 */
		notNull: function(value) {
			return !this.isNull(value);
		},

		/**
		 * Determines whether passed argument is null/undefined/NaN/empty string/zero/false
		 *
		 * @param  {object} value Value to examine
		 *
		 * @return {boolean} True if passed value is null/undefined/NaN/empty string/zero/false
		 */
		isNullOrEmpty: function(value) {
			if (value) {
				return false;
			}

			return true;
		},

		/**
		 * Determines whether passed argument is not null/undefined/NaN/empty string/zero/false
		 *
		 * @param  {object} value Value to examine
		 *
		 * @return {boolean} True if passed value is not null/undefined/NaN/empty string/zero/false
		 */
		notNullOrEmpty: function(value) {
			return !this.isNullOrEmpty(value);
		},

		/**
		 * Determines whether passed argument is a function
		 *
		 * @param  {object} value Value to examine
		 *
		 * @return {boolean} True if passed value a function
		 */
		isFunction: function(value) {
			return typeof value === 'function';
		},

		/**
		 * Determines whether passed argument is an array
		 *
		 * @param  {object} value Value to examine
		 *
		 * @return {boolean} True if passed value a array
		 */
		isArray: function(value) {
			return value instanceof Array;
		},

		/**
		 * .NET like string formatting function
		 *
		 * @param  {string} value  String to format
		 * @param  {array}  params Params to inject into string
		 * @return {string}        Formatted string
		 */
		format: function(value, params) {
			var i = 0,
				string = value,
				params = params || [];

			// Boost usage of this function correcting 'params' to array in case non-array value
			// has been passed. Sample usage: format('Your name is {0}', 'John');
			if (!this.isArray(params)) {
				params = [params];
			}

			for (i = 0; i < params.length; i++) {
				string = string.replace('{' + i + '}', this.notNullOrEmpty(params[i]) ? 
					params[i] : '');
			}

			return string;
		},

		/**
		 * Traverses the stylesheets on the document looking for the matched selector, then style.
		 *
		 * @author rlemon @ stackowerflow.com (original author)
		 * @author semir.babajic @ stackowerflow.com (improvements)
		 * @link   http://goo.gl/XWAoTu
		 *
		 * @param  {string}  style    Style to look for
		 * @param  {string}  selector CSS rule selector
		 * @param  {object}  sheet    Optional. Sheets to examine.
		 * @return {string}           Value for given style and selector
		 */
		css: function(style, selector, sheet) {
			var sheets = typeof sheet !== 'undefined' ? [sheet] : document.styleSheets,
				sheet = null,
				rule = null,
				selectors = null,
				i = 0,
				j = 0,
				value = null;

			for (i = 0, l = sheets.length; i < l; i++) {
				sheet = sheets[i];

				if (!sheet.cssRules) {
					continue;
				}

				for (j = 0, k = sheet.cssRules.length; j < k; j++) {
					if (_.notNull(value)) {
						return value;
					}

					rule = sheet.cssRules[j];
					if (_.isNullOrEmpty(rule.selectorText)) {
						continue;
					}

					// Get selectors from a rule
					selectors = rule.selectorText.split(',');

					// Make sure to strip off unwanted spaces
					$.each(selectors, function(key, v) {
						if (_.isNull(value) && v.trim() === selector) {
							value = rule.style[style];
						}
					});
				}
			}

			return value;
		},

		/**
		 * Butterfly internal functions
		 *
		 * @type {object}
		 */
		internals: {
			/**
			 * Keeps an eye on expired cache items and removes them
			 */
			startCacheWatchdog: function() {
				// No need for watchdog when localStorage is not supported
				if (_.isNullOrEmpty(window.localStorage)) {
					return;
				}

				if (!Butterfly.prototype.runtime.cache.watchdogStarted) {
					// Create a thread
					Butterfly.prototype.runtime.cache.watchdogHandle = setInterval(function() {
						for (var i in window.localStorage) {
							Butterfly.prototype.cache.removeIfExpired(i);
						}
					}, Butterfly.prototype.defaults.cache_watchdog_interval * 1000);

					// Mark as started
					Butterfly.prototype.runtime.cache.watchdogStarted = true;
				}
			},

			/**
			 * Container resizing logic
			 *
			 * @param  {object} container Container to resize
			 */
			resizeContainer: function(container) {
				var targetDevice = $('body').attr('class'),
					containerWidth = null,
					viewportVidth = $(window).width(),
					mobileWidth = parseInt(_.css('width', 'body.mobile div.container'));

				// Determine container optimal width based on user-defined preference
				if (_.isNullOrEmpty(targetDevice) || !(targetDevice in ['wide', 'default', 'mobile'])) {
					containerWidth = _.css('width', 'body div.container');
				} else {
					containerWidth = _.css('width',
						_.format('body.{0} div.container', targetDevice));
				}

				// Convert to numeric value
				containerWidth = parseInt(containerWidth);

				// Make sure to size container according to the viewport
				if (viewportVidth < containerWidth) {
					container.width(viewportVidth);
				}

				// Stop resizing responsive cells and make them 100% wide after viewport is
				// 640 or less pixels wide.
				if (viewportVidth <= mobileWidth + 1 || targetDevice === 'mobile') {
					container.find("div.cell").addClass("block");
					$("body").find(".sticky").hide();
				} else {
					container.find("div.cell").removeClass("block");
					$("body").find(".sticky").show();
				}

				// Viewport is (now) large enough to fit original container size
				if (viewportVidth > containerWidth && container.width() < containerWidth) {
					container.width(containerWidth);
				}
			},

			/**
			 * Resizes menu bar and makes it mobile friendly if viewport width is too narrow for
			 * regular display
			 *
			 * @param  {[type]} menu [description]
			 * @return {[type]}      [description]
			 */
			resizeNavigation: function(navigation) {
				var targetDevice = $('body').attr('class'),
					navigationWidth = $(navigation).width(),
					mobileWidth = parseInt(_.css('width', 'body.mobile div.container')),
					expanded, fixed;

				// TODO: Messy code here, clean up or stay away...
				if (navigationWidth <= mobileWidth + 1 || targetDevice === 'mobile') {
					navigation.find("li").addClass("block");
					if (!navigation.find(".touch-expand").length) {
						navigation.find("li").first().append('<div class="touch-expand"></div>');
						expanded = navigation.hasClass('expanded');
						navigation.parents("header").addClass("mobile-view");
						navigation.addClass("mobile-view");

						if (expanded === false) {
							navigation.find('li').not(':first-child').hide();
						} else {
							navigation.find('li').not(':first-child').show();
						}

						navigation.find('.touch-expand').bind('click', function() {
							navigation.toggleClass('expanded');
							expanded = navigation.hasClass('expanded');
							if (expanded === false) {
								navigation.find('li').not(':first-child').hide();
							} else {
								navigation.find('li').show();
							}
						});
					}
				} else {
					navigation.parents("header").removeClass("mobile-view");
					navigation.removeClass("mobile-view");
					navigation.find("li").removeClass("block").show().attr("style", "");
					navigation.find(".touch-expand").unbind().remove();
				}

				// Find tables and add responsive-wrap class to them. TODO: Think about this.
				$("table").each(function(i, e) {
					if (!$(e).parent().hasClass("responsive-table-wrap")) {
						$(e).wrap('<div class="responsive-table-wrap"></div>');
					}
				});
			},

			/**
			 * Main resize handler. Handles containers resizing.
			 */
			resize: function(args) {
				var self = this;

				if (!$('body').hasClass("fixed")) {
					// Look for container elements within body tag
					$("div.container, container").each(function(i, e) {
						self.resizeContainer($(e));
					});

					// Handle navigation resizing
					$("ul.navigation").each(function(i, e) {
						self.resizeNavigation($(e));
					});
				}
			}
		}
	};

	/**
	 * Prototype functions
	 *
	 * @type {object}
	 */
	Butterfly.prototype = {
		/**
		 * Current version number
		 * @type {string}
		 */
		version: "1.0.2",

		/**
		 * Release version
		 * @type {string}
		 */
		release: "beta",

		/**
		 * Default values
		 * 
		 * @type {object}
		 */
		defaults: {
			/**
			 * Default lifetime of templates in cache (minutes)
			 *
			 * @type {integer}
			 */
			template_cache_duration: 15,

			/**
			 * Default lifetime for cache items whose duration wasn't specified when set (minutes)
			 *
			 * @type {integer}
			 */
			cache_duration: 60,

			/**
			 * Default value for cache watchdog interval function (in minutes)
			 * @type {integer}
			 */
			cache_watchdog_interval: 5,

			/**
			 * Default values for various UI animation effects (miliseconds)
			 * @type {integer}
			 */
			effects_duration: 200,

			/**
			 * Context classes as defined in CSS
			 * @type {array}
			 */
			context_classes: ['info', 'success', 'warning', 'critical', 'neutral']
		},

		/**
		 * Helper variables determined/set during library's runtime
		 *
		 * @type {object}
		 */
		runtime: {

			/**
			 * Used by dialog plugin
			 * @type {Object}
			 */
			dialogs: {
				/**
				 * [front description]
				 * @type {Number}
				 */
				front: 20000
			},

			/**
			 * Runtime variables used by cache watchdog function
			 * @type {Object}
			 */
			cache: {
				watchdogStarted: false,
				watchdogHandle: null
			},

			/**
			 * Library callbacks like ready, etc
			 * @type {Object}
			 */
			callbacks: {

			}
		},

		/**
		 * Basic caching functions built around Local Storage. It supports cache item timeout,
		 * listener thread, callbacks, etc.
		 *
		 * @type {object}
		 */
		cache: {
			/**
			 * Prefix to use for butterfly cache items. Prefix is required to prevent
			 * overwriting user defined local storage items (if local storage is enabled)
			 *
			 * @type {object}
			 */
			prefix: 'butterfly_cache_',

			/**
			 * Determines storage object. If Local Storage isn't available, Butterfly will
			 * provide compatible object where caching will be performed temporarily, making
			 * cached data available until page is refreshed/closed.
			 *
			 * @type {object}
			 */
			storage: _.notNullOrEmpty(window.localStorage) ? window.localStorage : {
				/**
				 * Object containing cached items
				 *
				 * @type {object}
				 */
				items: {},

				/**
				 * Stores item into storage array
				 *
				 * @param {string}  key      Key to store
				 * @param {string}  value    Value to store
				 */
				setItem: function(key, value) {
					this.items[key] = value;
				},

				/**
				 * Reads item from storage array
				 *
				 * @param  {string} key Key to retrieve
				 * @return {string}     Cached value
				 */
				getItem: function(key) {
					if (_.isNullOrEmpty(this.items[key])) {
						return null;
					}

					return this.items[key];
				},

				/**
				 * Removes item from storage array
				 *
				 * @param  {string}  key Key to remove
				 */
				removeItem: function(key) {
					if (_.isNullOrEmpty(this.items[key])) {
						return;
					}

					delete this.items[key];
				},

				/**
				 * Removes all items from cache
				 */
				clear: function() {
					this.items = {};
				}
			},

			/**
			 * Formats key for cache items
			 *
			 * @param  {string} key Key name to use
			 * @return {string}     Formatted cache item key, safe
			 */
			formatKey: function(key) {
				return _.format('{0}{1}', [this.prefix, key]);
			},

			/**
			 * Stores item into cache
			 *
			 * @param  {string}  key      Key to store
			 * @param  {string}  value    Value to store
			 * @param  {integer} duration Duration in minutes until item expiress
			 */
			store: function(key, value, duration) {
				// Default duration
				duration = duration || Butterfly.prototype.defaults.cache_duration;

				this.storage.setItem(this.formatKey(key), JSON.stringify({
					expires: new Date().getTime() + duration * 60000,
					data: value
				}));
			},

			/**
			 * Reads item from cache.
			 *
			 * @param  {string} key Key to read
			 * @return {object}     Cached value or null if key was not found or expired
			 */
			read: function(key) {
				var formattedKey = this.formatKey(key),
					item = this.storage.getItem(formattedKey);

				// Before further processing, ensure that item exists in cache
				if (_.isNullOrEmpty(item)) {
					return null;
				}

				// Deserialize content
				try {
					item = JSON.parse(item);
				} catch(e) {
					return null;
				}

				// Return stored value only if item hasn't expired by now
				if (new Date().getTime() < item.expires) {
					return item.data;
				}

				// Delete expired item and return null
				this.storage.removeItem(formattedKey);

				// Nothing to return for expired items
				return null;
			},

			/**
			 * Removes item from cache only if it's expired (used by watchdog only)
			 * 
			 * @param  {string} key Key to examine
			 */
			removeIfExpired: function(key) {
				item = this.storage.getItem(key);

				// Before further processing, ensure that the item exists in cache
				if (_.isNullOrEmpty(item)) {
					return null;
				}

				// Deserialize content
				try {
					item = JSON.parse(item);
				} catch(e) {
					return;
				}

				// Return if it hasn't expire yet
				if (new Date().getTime() < item.expires) {
					return;
				}

				// Delete expired item
				this.storage.removeItem(key);
			},

			/**
			 * Removes cached item
			 *
			 * @param  {string} key Key to remove
			 */
			remove: function(key) {
				this.storage.removeItem(this.formatKey(key));
			},

			/**
			 * Clears cache (removes all items)
			 */
			clear: function() {
				this.storage.clear();
			}
		},

		/**
		 * Micro templating engine built around the core code originally developed by John Resig.
		 *
		 * Made numerous improvements including: 
		 * - proper whitespace preservation
		 * - single quote issue fixed
		 * - multiline js block allowed
		 * - added Butterfly's caching layer
		 * - added basic error reporting to the compiler
		 *
		 * @param 	{string} template	Template string to compile
		 * @param 	{object} context	Data context (variables scope template will use)
		 *
		 * @return 	{boolean} Compiled template
		 */
		template: function template(content, context) {
			var template = content,
				fn = null,
				compiled = null;

			if (content instanceof $) {
				template = $(content).html();
			}

			try {
				// Execute templating function. TODO: Implement short term caching of compiled HTML
				compiled = this.cache.read(template);

				// Nothing in cache, compile the template and cache
				if (_.isNullOrEmpty(compiled)) {
					fn = "var parsed=[];with(context){parsed.push('" +
						template.replace(/\t(?![^%]*%>)/g, "\\t")
						.replace(/(\r?\n)(?![^%]*%>)/g, "\\n")
						.replace(/[\r\t\n]/g, " ")
						.replace(/'(?=[^%]*%>)/g, "\t")
						.split("'").join("\\'")
						.split("\t").join("'")
						.replace(/<%=(.+?)%>/g, "',$1,'")
						.split("<%").join("');")
						.split("%>").join("parsed.push('") + "');}return parsed.join('');";

					compiled = new Function("context", fn)(context);

					// Store into cache
					this.cache.store(template, compiled,
						Butterfly.prototype.defaults.template_cache_duration);
				}
			} catch (e) {
				throw new Error("Template compilation error, aborting.\n\r\n\r" +
					e + "\n\r\n\r" + e.stack);
			}

			// Store compiled results into in case of jQuery object
			if (content instanceof $) {
				$(content).html(compiled);
			}

			return compiled;
		},

		/**
		 * Asynchronous module definition (AMD) utility function
		 *
		 * @param  {array}    modules Array containing modules to load
		 * @param  {function} done    Callback to be fired after modules have all been fetched
		 * @return {function}
		 */
		modules: function modules(modules, done) {
			var request = "",
				response = "",
				successCallback = "",
				then = "",
				context = {
					done: typeof done !== "undefined" ? done : function() {}
				},
				m,
				mimeType,
				type,
				compile,
				fn;

			for (m in modules) {
				mimeType = "";
				module = modules[m];
				type = module.split('.').pop();
				compile = true;

				// Do not compile resource
				if (module[0] === '!') {
					compile = false;
					module = module.substring(1);
				}

				switch (type) {
					case "js":
						request += "$.ajax({url:'" + module + "',dataType:'text'}),";
						response += "r" + m + ",";

						if (compile) {
							successCallback += "eval(typeof r" + m + "==='string'?r" + m + ":r" + m + "[0]),";
						} else {
							successCallback += "r" + m + "[0],";
						}

						break;
					case "htm":
					case "html":
						request += "$.get('" + module + "'),";
						response += "r" + m + ",";

						if (compile) {
							successCallback += "Butterfly.prototype.template(r" + m + "[0],window),";
						} else {
							successCallback += "r" + m + "[0],";
						}

						request += "$.get('" + module + "'),";

						break;
					case "css":
						request += "$.get('" + module + "'),";
						response += "r" + m + ",";

						if (compile) {
							successCallback += "$('head').append('<style type=\"text/css\">' + Butterfly.prototype.template(r" + m + "[0],window) + '</style>'),";
						} else {
							successCallback += "$('head').append('<style type=\"text/css\">' + r" + m + "[0] + '</style>'),";
						}
						break;

					default:
						request += "$.get('" + module + "'),";
						response += "r" + m + ",";
						successCallback += "r" + m + "[0],";
				}
			}

			// Remove excess comma
			request = request.slice(0, -1);
			response = response.slice(0, -1);
			successCallback = successCallback.slice(0, -1);

			fn = new Function("c", "s", "$.when(" + request + ").done(function(" + response + "){try{c.done.call(s," + successCallback + ")}" +
				"catch(e){throw new Error('Module load error, aborting. (' + e + ')')};});");

			return new fn(context, this);
		},

		/**
		 * Routes listener
		 *
		 * @param  {object} routes Routes definition structure defining callbacks to be fired
		 *                         every time a route has been changed.
		 */
		router: function router(routes) {
			var self = this;

			/**
			 * Ignore changing hash part of the url for links with a in-page-anchor class
			 */
			this.anchors = function() {
				$(".in-page-anchor").bind("click", function(e) {
					var element = $("#" + $(this).attr("anchor-href")),
						top = element.length ? element.offset().top : null;

					if (_.notNull(top)) {
						$('html, body').animate({
							scrollTop: top
						}, 100);
					}
				});
			};

			this.anchor = function(href) {
				var element = $("#" + href),
					top = element.length ? element.offset().top : null;

				if (_.notNull(top)) {
					$('html, body').animate({
						scrollTop: top
					}, 100);
				}
			};

			/**
			 * Listens for route changes
			 * @return {[type]} [description]
			 */
			this.listen = function() {
				// React on all changes in URL made after # character
				$(window).bind("hashchange", function(e) {
					// Get hash parameters
					var parameters = [],
						query = window.location.hash.replace("#", "").split("/"),
						route = window.location.hash === "" ? "index" : "";

					if (query.length > 0) {
						route = typeof routes[query[0]] === "undefined" ? route : query[0];

						if (query.length > 1 && route === "index") {
							query.shift();
						}
					}

					// Execute route if it was defined by the user
					if (typeof routes[route] !== "undefined") {
						if (routes[route] instanceof Butterfly.conventionRoute) {

							// See if there's any user defined code that he needs to execute
							// in router for this route
							if (_.notNullOrEmpty(routes[route].callback) && _.isFunction(routes[route].callback)) {
								routes[route].callback.call();
							}

							// This route is compliant to Butterfly's convention. Load matching
							// controller.
							Butterfly.modules([
								_.format("js/controller/{0}Controller.js", route)
							], function(controller) {
								self.controller = controller;
								if (
									_.notNullOrEmpty(controller.destroy) && _.isFunction(controller.destroy)) {
									self.dispose = controller.destroy;
								}
								self.controller.query = query;
							});
						} else {
							// Retrieve dispose handler for current route
							self.dispose = routes[route].call(self, query);
						}

						// Call lost handler on previously loaded route
						if (self.current !== route && self.dispose && _.isFunction(self.dispose)) {
							self.dispose.call(self, query);
						}

						// Set current route
						self.current = route;

						// Mark matching navigation pill as active
						var matchingNavPill = $('ul.navigation a[href="#' + route + '"]');
						$('ul.navigation a').removeClass('active');
						matchingNavPill.addClass('active');

						// Scroll to top
						window.scrollTo(0, 0);
					}
				}).trigger("hashchange");
			};

			/**
			 * Navigates back
			 */
			this.back = function() {
				window.history.back();
			};

			/**
			 * Navigates forward
			 */
			this.forward = function() {
				window.history.forward();
			};

			this.go = function(route, query) {
				if (_.notNullOrEmpty(query)) {
					document.location.hash = route + "/" + query;
				} else {
					document.location.hash = route;
				}
			}
		},

		/**
		 * [route description]
		 * @param  {[type]} options [description]
		 * @return {[type]}         [description]
		 */
		conventionRoute: function(callback) {
			this.callback = callback;
		},

		/**
		 * Butterfly list object.
		 *
		 * @param  {object} data Initial list data
		 */
		list: function(data) {
			var self = this;
			self.data = data;

			self.set = function(index, value) {
				var old = self.data[index];

				self.data[index] = value;

				if (_.isNullOrEmpty(self.changed) || !_.isFunction(self.changed)) {
					return;
				}

				self.changed.call(self, index, self.data[index], old);
			};

			self.add = function(value) {
				if (_.isArray(self.data)) {
					if (!_.isArray(value)) {
						self.data.push(value);
					} else {
						for (var i in value) {
							self.data.push(value[i]);
						}
					}
				} else {
					for (var k in value) {
						self.data[k] = value[k];
					}
				}

				if (_.isNullOrEmpty(self.added) || !_.isFunction(self.added)) {
					return;
				}

				self.added.call(self, value);
			};

			self.delete = function(index) {
				var deleted = self.data[index];
				delete self.data[index];

				if (_.isNullOrEmpty(self.deleted) || !_.isFunction(self.deleted)) {
					return;
				}
				self.deleted.call(self, index, deleted);
			};

			self.get = function(index) {
				if (!index || typeof index === "undefined")
					return self.data[0];
				return self.data[index];
			};

			self.destroy = function() {
				delete self;
			};

			return self;
		},

		/**
		 * Butterfly property object with basic events
		 * 
		 * @param  {object} data Property content
		 */
		property: function(data) {
			var self = this;
			self.data = data;

			self.set = function(value) {
				var old = self.data;

				self.data = value;

				if (_.isNullOrEmpty(self.changed) || !_.isFunction(self.changed)) {
					return;
				}

				self.changed.call(self, self.data, old);
			};

			self.get = function() {
				return self.data;
			};

			self.destroy = function() {
				delete self;
			}

			return self;
		},

		/**
		 * Butterfly model
		 * 
		 * @param  {object} context 
		 * @return {object}         
		 */
		model: function(context) {
			if (context.initialize && typeof context.initialize === "function") {
				context.initialize();
			}

			/**
			 * Destroys resources
			 * @return {[type]} [description]
			 */
			self.destroy = function() {
				if (context.destroy && typeof context.destroy === "function")
					context.destroy.call(context);
			};

			return context;
		},

		/**
		 * [controller description]
		 * @param  {[type]} context [description]
		 * @return {[type]}         [description]
		 */
		controller: function(context) {
			var self = this,
				model = context.model,
				views = context.views;

			// Make sure view(s) is/are not auto compiled in a global scope
			if (typeof views === "string") {
				var views = views[0] === "!" ? views : "!" + views;
			} else {
				for (var v in views) {
					views[v] = views[v][0] === "!" ? views[v] : "!" + views[v];
				}
			}

			// Parse context
			context.target = typeof context.target === "undefined" ? "body" : context.target;
			context.target = context.target instanceof jQuery ? context.target : $(context.target);

			/**
			 * [render description]... NEVER CALL THIS BEFORE INITIALIZE IS DONE!!!!
			 * @return {[type]} [description]
			 */
			context.render = function() {
				// Compile the template
				var compiled = Butterfly.template(context.views, context);

				// Append compiled template to given target
				$(context.target).empty();
				$(context.target).append(compiled);

				// Reinitialize butterfly to make sure the compiled template is affected by library 
				// native functions, too
				Butterfly.prototype.reinitialize();

				// Template is rendered, let user bind events and do stuff with it
				if (context.ready && typeof context.ready === "function") {
					context.ready.call(context);
				}
			};

			// Fetch module and views
			if (_.notNullOrEmpty(model) || _.notNullOrEmpty(views)) {
				// Fetch both
				if (_.notNullOrEmpty(model) && _.notNullOrEmpty(views)) {
					Butterfly.modules([
						model,
						views
					], function(m, v) {
						// Make loaded model and views availale in context
						context.model = m;
						context.views = v;

						// Call initialize
						context.initialize();
					});
				}

				// Fetch model only
				if (_.notNullOrEmpty(model)) {
					Butterfly.modules([
						model
					], function(m) {
						context.model = m;
						context.initialize();
					});
				}

				// Fetch views only
				if (_.notNullOrEmpty(views)) {
					Butterfly.modules([
						views
					], function(v) {
						context.views = v;
						context.initialize();
					});
				}
			} else {
				context.initialize();
			}

			/**
			 * Destroys resources
			 * @return {[type]} [description]
			 */
			this.destroy = function() {
				if (context.destroy && typeof context.destroy === "function") {
					context.destroy.call(context);
				}
			};

			return context;
		},

		/**
		 * Events unbinding function (clears previously attached events)
		 */
		unbind: function() {
			$(window).unbind('resize');
		},

		/**
		 * Events binding function
		 */
		bind: function() {
			var self = this;

			// Bind resize event
			$(window).bind('resize', function() {
				_.internals.resize();
			});
		},

		/**
		 * Reinitialize function (counterpart of initialize)
		 *
		 * @return {boolean} True if Butterfly was able to initialize, false otherwise
		 */
		reinitialize: function() {
			// Bind event handlers (unbind first, as initialize is also used as re-initialize)
			this.unbind();
			this.bind();

			// Manually call resize gateway to calculate initial container width (mobile devices)
			_.internals.resize();
		}
	};

	// Ensure Butterfly is in global scope
	Butterfly = Butterfly;
	Butterfly.cache = Butterfly.prototype.cache;
	Butterfly.template = Butterfly.prototype.template;
	Butterfly.router = Butterfly.prototype.router;
	Butterfly.conventionRoute = Butterfly.prototype.conventionRoute;
	Butterfly.modules = Butterfly.prototype.modules;
	Butterfly.property = Butterfly.prototype.property;
	Butterfly.list = Butterfly.prototype.list;
	Butterfly.model = Butterfly.prototype.model;
	Butterfly.controller = Butterfly.prototype.controller;
	Butterfly.defaults = Butterfly.prototype.defaults;

	// Callbacks
	Butterfly.ready = function(callback) {
		// Store user defined ready function to call it once initialized
		Butterfly.prototype.runtime.callbacks['ready'] = callback;
	};

	/**
	 * Main initialization point which should be fired only once
	 *
	 * @return {boolean} True if Butterfly was able to initialize, false otherwise
	 */
	$(document).ready(function() {
		// Start cache watchdog that should pick up expired items. This prevents
		// cache to fill.
		_.internals.startCacheWatchdog();

		Butterfly.prototype.reinitialize();

		if (_.isFunction(Butterfly.prototype.runtime.callbacks['ready'].call(this))) {		
			Butterfly.prototype.runtime.callbacks['ready'].call(this);
		}
	});

	/**
	 * Butterfly sticky box
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	$.fn.sticky = function(options) {
		// Create new instance of existing Butterfly
		var instance = new Butterfly(this, options);

		// Extend Butterfly instance with sticky plugin functions
		$.extend(instance, {
			top: null,
			width: null,

			_construct: function(butterfly) {
				var self = this;

				self.top = self.$element.offset().top;
				self.width = self.$element.width();

				$(window).scroll(function(e) {
					var scrollY = $(window).scrollTop(),
						eTop = 0;

					if (scrollY > self.top) {
						self.$element.css("position", "fixed");
						self.$element.css("width", self.width + "px");
						self.$element.addClass("glued");
					} else {
						self.$element.css("position", "relative");
						self.$element.css("width", "auto");
						self.$element.removeClass("glued");
					}

				});

				// Allow chaining
				return self.$element;
			}
		});

		return instance._construct.apply(instance);
	};

	/**
	 * Butterfly scroll spy plugin
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	$.fn.tocspy = function(options) {
		// Create new instance of existing Butterfly
		var instance = new Butterfly(this, options);

		// Extend Butterfly instance with plugin functions
		$.extend(instance, {
			top: null,
			width: null,

			_construct: function(butterfly) {
				var self = this,
					actual = $('a.actual');

				self.top = self.$element.offset().top;
				self.width = self.$element.width();

				if (actual.length) {
					if (actual.next().hasClass('sub-list')) {
						actual.parent().addClass('actual');
					}
				}

				$(window).scroll(function(e) {
					$(".anchor").each(function(i, e) {
						eTop = $(e).offset().top;
						if (scrollY >= eTop - 5) {
							self.$element.find("a, li").removeClass("actual");
							var elem = self.$element.find('a[anchor-href="' + $(e).attr("id") +
								'"]').addClass("actual");

							if (elem.parents("ul.sub-list").length) {
								elem.parents("ul.sub-list").parents("li").first().addClass("actual");
							}
							if (elem.next().hasClass("sub-list")) {
								elem.parent().addClass("actual");
							}
						}
					});
				});

				// Allow chaining
				return self.$element;
			}
		});

		return instance._construct.apply(instance);
	};

	/**
	 * Butterfly progress loader plugin
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	$.fn.loader = function(options) {
		// Create new instance of Butterfly
		var instance = new Butterfly(this, options);

		// Extend Butterfly instance with plugin functions
		$.extend(instance, {
			_construct: function() {
				if (!this.$element.find(".loader-progress").length) {
					this.$element.prepend('<div class="loader-progress"><div class="progress"></div></div>');
				}

				// Parse options from attributes (those will override ones set via JS code)
				var options = {};

				// Defaults
				options.position = "fixed";
				options.initial = 0;

				// Overwrite default options by user defined options
				this.options = $.extend({}, options, this.options);
				this.$progress = this.$element.find(".progress");

				// Apply positioning
				this.$progress.parent().css("position", this.options.position);

				return this;
			},

			show: function(initial) {
				this.$progress.parent().show();
				this.percentage(this.options.initial);
				return this;
			},

			percentage: function(percent, done) {
				var viewportWidth = $(window).width();

				if (percent === 0) {
					if (_.isFunction(done)) {
						done();
					}
					return;
				}

				this.$progress.animate({
					width: percent + '%',
					duration: 20
				}, function() {
					if (_.isFunction(done)) {
						done();
					}
				});
				return this;
			},

			hide: function() {
				var self = this;
				this.percentage(100, function() {
					self.$progress.parent().remove();
				});
				return this;
			}
		});

		return instance._construct.apply(instance);
	};

	/**
	 * Butterfly window
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	$.fn.dialog = function(options) {
		// Create new Butterfly instance
		var instance = new Butterfly(this, options);

		// Extend Butterfly instance with dialog plugin functions
		$.extend(instance, {
			_construct: function() {
				var self = this;

				// Parse options from attributes (those will override ones set via JS code)
				var options = {};

				// Defaults
				options.modal = self.$element.hasClass("modal");
				options.moveable = self.$element.hasClass("moveable");
				options.clone = self.$element.hasClass("clone");
				options.width = self.$element.width();
				options.title = self.$element.find(".header h1").text();

				// Overwrite default options by user defined options
				$.extend(options, self.options);

				self.options = options;

				// Clone the source HTML and create new element for this dropdown
				if (self.options.clone) {
					var $parent = self.$element.parent();
					self.$element = self.$element.clone().removeAttr("id");
					$parent.prepend(self.$element);
				}

				// Return window object
				return self;
			},

			/**
			 * [show description]
			 * @return {[type]} [description]
			 */
			show: function() {
				var self = this;

				// Showing callback
				if (self.options.showing) {
					// Event arguments
					var args = {
						cancel: false
					};

					self.options.showing.call(self, args);

					if (args.cancel === true) {
						return;
					}
				}

				// Do not do anything on previously shown dialogs. This will never happen
				// on dialogs meant to be cloned, though.
				if (self.$element.is(":visible")) {
					return;
				}

				// Center the element
				self.$element.width(self.options.width);
				self.$element.css("left", ($(window).width() - self.options.width) / 2 + "px");
				self.$element.find(".header h1").text(self.options.title);

				// Blur all other opened dialogs
				self.sendToBack();

				// Display window
				if (self.options.modal) {
					var overlayClass = '';
					for (var k in self.defaults.context_classes) {
						if (self.$element.hasClass(self.defaults.context_classes[k])) {
							overlayClass = self.defaults.context_classes[k];
							break;
						}
					}
					$("body").prepend("<div class='overlay " + overlayClass + "'></div>").find(".overlay").not(":first-child").remove();

					// Display overlay and bind click event that will close the window
					$(".overlay").fadeIn(self.defaults.effects_duration).bind("click", function() {
						self.close();
					});

					self.$element.fadeIn(self.defaults.effects_duration, function() {
						// Execute shown callback
						if (self.options.shown) {
							self.options.shown.apply(self);
						}

						self.$element.trigger("focus");
					});

				} else {
					// Execute shown callback
					if (self.options.shown) {
						self.options.shown.apply(self);
					}

					self.$element.show();
					self.$element.trigger("focus");

					self.bringToFront();
				}

				// Allow window to gain focus, and focus it
				self.$element.attr('tabindex', 0).focus();

				// Listen for keyboard events
				self.$element.bind("keyup", function(e) {
					if (e.keyCode === 27) {
						self.close();
					}
				});

				// If configured as moveable...
				if (self.options.moveable) {
					self.$element.moveable({
						handle: ".header",
						ignore: ".button-group"
					});

					self.$element.moveable({
						handle: ".footer",
						ignore: ".button-group"
					});
				}

				// Handles close button and prevent it from ever getting focus
				self.$element.find(".dismiss").bind("click", function(e) {
					self.close();
				}).bind("focus", function(e) {
					$(this).blur();
					self.$element.trigger("focus");
				});

				// Handles focus and blur events
				self.$element.bind("focus", function() {
					self.focus();
				}).bind("blur", function() {
					self.blur();
				}).bind("mousedown", function(e) {
					self.bringToFront();
				}).bind("click", function(e) {
					$(this).trigger('focus');
				});

				return self;
			},

			blur: function() {
				var self = this;

				// Blur callback
				if (self.options.blur) {
					self.options.blur.apply(self);
				}

				return self;
			},

			focus: function() {
				var self = this;

				// Blur all other opened dialogs
				self.sendToBack();

				// Bring focused window to top
				self.bringToFront();

				// Focus callback
				if (self.options.focus) {
					self.options.focus.apply(self);
				}

				return self;
			},

			/**
			 * [close description]
			 * @return {[type]} [description]
			 */
			close: function() {
				var self = this;

				if (self.options.closing) {
					// Event arguments
					var args = {
						cancel: false
					};

					self.options.closing.apply(self, args);

					if (args.cancel === true) {
						return;
					}
				}

				// Cleanup work
				self.$element.css("z-index", "");

				// Stop listening for events
				self.$element.unbind();
				self.$element.find(".header, .footer").unbind();

				// Dispose overlay
				$(".overlay").fadeOut(self.defaults.effects_duration);

				// Dismiss window and execute callback
				self.$element.fadeOut(self.defaults.effects_duration, function() {

					if (self.options.clone) {
						self.$element.remove();
					}

					if (self.options.closed) {
						self.options.closed.call(self);
					}

					// Iterate through opened windows and focus next that's top most
					var d = null,
						z = 0,
						tz = 0;

					$(".dialog").each(function(i, e) {
						tz = parseInt($(e).css("z-index"));

						if (tz > z && $(e).is(":visible")) {
							z = tz;
							d = $(e);
						}
					});

					if (d !== null) {
						d.trigger("focus");
					}
				});

				return self;
			},

			/**
			 sendToBack description]
			 * @return {[type]} [description]
			 */
			sendToBack: function() {
				var self = this;

				// Blurs all other opened dialogs
				$(".dialog:visible").each(function(i, e) {
					// Do not trigger blur on own element
					if ($(e)[0] !== self.$element[0]) {
						$(e).trigger("blur");
					}
					$(e).removeClass("focus");
				});

				return self;
			},

			bringToFront: function() {
				var self = this;

				// Send others to back by forcing them to lose focus
				self.sendToBack();

				if (!self.options.modal) {
					this.runtime.dialogs.front++;
					self.$element.css("z-index", this.runtime.dialogs.front);
					self.$element.addClass("focus");
				}

				return self;
			}
		});

		// Return instance
		return instance._construct.apply(instance);
	};

	/**
	 * Makes an element moveable
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	$.fn.moveable = function(options) {
		var $element;

		// Default option values
		options = $.extend({
			handle: "",
			cursor: "default",
			ignore: ""
		}, options);

		// Detect handle
		if (options.handle === "") {
			$element = this;
		} else {
			$element = this.find(options.handle);
		}

		if (options.ignore !== "") {
			// Disable moveable on buttons
			$element.find(options.ignore).bind("mousedown", function(e) {
				e.stopPropagation();
			});
		}

		return $element.css('cursor', options.cursor).on("mousedown", function(e) {
			var $drag;

			if (options.handle === "") {
				$drag = $(this).addClass('butterfly-moveable');
			} else {
				$drag = $(this).addClass('active-handle').parent().addClass('butterfly-moveable');
			}

			var zIndex = $drag.css('z-index'),
				dragH = $drag.outerHeight(),
				dragW = $drag.outerWidth(),
				posX = $drag.offset().top + dragH - e.pageY,
				posY = $drag.offset().left + dragW - e.pageX;

			$drag.parents().on("mousemove", function(e) {
				$('.butterfly-moveable').offset({
					top: e.pageY + posX - dragH,
					left: e.pageX + posY - dragW
				}).on("mouseup", function() {
					$(this).removeClass('butterfly-moveable').css('z-index', zIndex);
				});
			});

			e.preventDefault();
		}).on("mouseup", function(e) {
			if (options.handle === "") {
				$(this).removeClass('butterfly-moveable');
			} else {
				$(this).removeClass('active-handle').parent().removeClass('butterfly-moveable');
			}
		});
	};

})(jQuery);