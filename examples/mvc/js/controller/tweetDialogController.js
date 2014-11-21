/**
 * Compose tweet dialog - controller (not managed by router)
 */
Butterfly.controller({

	/**
	 * Tells where view templates need to be rendered
	 */
	target: '#compose',

	/**
	 * Views for this route (just one needed in this case)
	 */
	views: 'template/compose.html',

	/**
	 * Called by contoller itself once modules have been prefetched
	 */
	initialize: function() {
		// Preserving context for later use
		var self = this;

		// Render templates
		this.render();

		// Prefetch modules needed for this route
		Butterfly.modules([
			"js/controller/composeTweetController.js"
		], function(compose) {
			self.compose = compose;

			$(".compose-tweet").bind("click", function() {
				self.dialog = $("#compose-dialog").dialog().show();
			});

			// Attach compose controller to an HTML view
			self.compose.attach($("#compose-dialog"));
		});

		/**
		 * Subscribe to "tweet_submitted" event
		 */
		self.tweetSubmittedHandler = Butterfly.pubsub.subscribe("tweet_submitted", function() {
			if (self.dialog) {
				self.dialog.close();
			}
		});
	},

	/**
	 * Destroys controller resources
	 */
	destroy: function() {
		$(".compose-tweet").unbind("click");
		Butterfly.pubsub.unsubscribe(this.tweetSubmittedHandler);
	}

});