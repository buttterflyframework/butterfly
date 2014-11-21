/**
 * Controller for handling profile route (managed by router).
 */
Butterfly.controller({

	/**
	 * View(s) that will be preloaded 
	 */
	views: 'template/profile.html',

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

		// Prefetch modules
		Butterfly.modules([
			"js/controller/tweetsStreamController.js",
			"js/controller/tweetDialogController.js"
		], function(tweets, dialog) {
			self.tweets = tweets;
			self.tweets.attach($(".tweets-stream"));
			self.compose = dialog;
		});

		// Listen for an event to know when to update tweets
		self.tweetSubmittedHandler = Butterfly.pubsub.subscribe("tweet_submitted", function() {
			self.tweets.refreshTweets();
		});
	},

	/**
	 * Disposes resourcess
	 */
	destroy: function() {
		Butterfly.pubsub.unsubscribe(this.tweetSubmittedHandler);
	}

});