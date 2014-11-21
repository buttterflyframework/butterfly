/**
 * Controller for tweets stream (not managed by router)
 */
Butterfly.controller({

	/**
	 * Initializes controller
	 */
	attach: function(control) {
		var self = this;
		self.control = control;

		Butterfly.modules([
			"template/tweet.html"
		], function(tweet) {
			self.tweet = tweet;
		
			self.refreshTweets();
		});
	},

	/**
	 * Refreshes tweets
	 */
	refreshTweets: function() {
		var tweets,
			tweet,
			tweetModel = null,
			self = this;

		if (localStorage.getItem("tweets")) {
			tweets = JSON.parse(localStorage.getItem("tweets"));
			self.control.empty();
		} else {
			tweets = [];
		}

		tweets.sort(function(a, b) {
			return b.date > a.date ? -1 : 1;
		});

		for (tweet in tweets) {
			tweetModel = new Butterfly.model();

			// Apped template
			self.control.append(self.tweet);

			// Map template to a model
			tweetModel.mapTo(self.control.find(".tweet").last());

			// Populate model using stored tweet object
			tweetModel.fromJson(tweets[tweet]);
		}
	},

	/**
	 * Destroy resources
	 */
	destroy: function() {
		
	}
});