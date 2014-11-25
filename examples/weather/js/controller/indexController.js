/**
 * Controller for handling index route (managed by router).
 */
Butterfly.controller({

	/**
	 * View(s) that will be preloaded 
	 */
	views: 'template/dashboard.html',

	/**
	 * Views rendering target (performs overwrite)
	 */
	target: '#main',

	/**
	 * Initializes controller
	 */
	initialize: function() {
		var self = this;

		// Render templates
		this.render();

		// Fetch weather widget HTML
		Butterfly.modules([
			"!template/weather.html"
		], function(template) {
			self.template = template;
	
			// Bind events
			self.bind();
		});

		// Bind city input to a property
		self.city = new Butterfly.property($("#city"));
	},

	bind: function() {
		var self = this;

		$("#update").bind("click", function() {
			self.fetch(self.city.get());
		}).removeClass("disabled");
	},

	fetch: function(city) {
		var self = this;

		// Simple UI tweaks to show loader
		$("#content").loader({initial: 1}).show();

		$.get("http://api.openweathermap.org/data/2.5/find", {
			q: city,
			units: 'metric'
		}).done(function(response) {
			self.update(response);
		});
	},

	update: function(response) {
		var self = this, 
			index, object, compiled;

		$("#weather-info").fadeOut(function() {
			// Clear previous entries
			$(this).empty();

			for (index in response.list) {
				object = response.list[index];
				compiled = Butterfly.template(self.template, object, false);

				$("#weather-info").append(compiled);
			}
		}).fadeIn()

		$("#content").loader().hide();
	},

	/**
	 * Destroys controller resources
	 */
	destroy: function() {
		$("#update").unbind("click");
	}

});