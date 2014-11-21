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

		// Fetching modules to build up this page
		Butterfly.modules([
			"js/controller/composeTweetController.js",
			"js/controller/tweetsStreamController.js",
			"js/controller/tweetDialogController.js"
		], function(compose, tweets, tweetDialog) {
			self.compose = compose;
			self.tweets = tweets;
			self.tweets.attach($(".tweets-stream"));
			self.dialog = tweetDialog;

			// Call the attach function on the compose
			self.compose.attach($(".dashboard-compose"));
		});

		// Call a function that's handling various global events
		self.tweetSubmittedHandler = Butterfly.pubsub.subscribe("tweet_submitted", function() {
			self.tweets.refreshTweets();
		});
	},

	/**
	 * Destroys controller resources
	 */
	destroy: function() {
		Butterfly.pubsub.unsubscribe(this.tweetSubmittedHandler);
	}

});