/**
 * Controller for compose tweet feature (not managed by router)
 */
Butterfly.controller({

	/**
	 * When called, attaches models to the given control and starts listening for cahnges
	 * @param  {object} control jQuery HTML element to attach to
	 */
	attach: function(control) {
		var self = this;

		// Initialize models
		self.model = new Butterfly.model({});

		// Preserve jQuery element
		self.control = control;

		// Map model to the HTML
		self.model.mapTo(control, function() {
			// React when tweet text changes
			self.model.tweet.changed = function(args) {
				// It is so simple to cancel the changed event, which will also cancel
				// a change on underlying jQuery input element
				if (args.value.length > 140) {
					args.cancel = true;
					return;
				}

				// Tell user how many characters he can type
				self.model.left.set(140 - args.value.length);
			};
		});

		// Bind event handlers
		control.find(".submit-tweet").bind("click", function(e) {
			// Delegate control to submitTweet function
			self.submitTweet();
		});
		control.find("form").bind("submit", function(e){
			e.preventDefault();
			return false;
		});
	},

	/**
	 * Submits a tweet into local storage and publishes global event called "tweet_submitted" 
	 */
	submitTweet: function() {
		// No empty tweets
		if (this.model.tweet.get() === '') {
			return;
		}

		// Store submission date
		this.model.date = (new Date()).getTime();

		// Convert model into JSON object
		var data = this.model.toJson(),
			tweets;

		// Store tweet into a local storage
		if (localStorage.getItem("tweets")) {
			tweets = JSON.parse(localStorage.getItem("tweets"));
		} else {
			tweets = [];
		}

		// Push tweet to the localStorage structure
		tweets.push(data);

		// Persist tweets into local storage
		localStorage.setItem("tweets", JSON.stringify(tweets));

		// Clean up
		this.model.tweet.set('');

		// Publish event
		Butterfly.pubsub.publish("tweet_submitted");
	},

	/**
	 * Disposes resources and detaches events 
	 */
	destroy: function() {
		this.control.find(".submit-tweet").unbind("click");
		this.control.find("form").unbind("submit");
	}

});