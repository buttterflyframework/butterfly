/**
 * Fired after library is ready for use
 */
Butterfly.ready(function() {

	/**
	 * Routes definition
	 */
	window.Router = new Butterfly.router({
		/**
		 * Convention route for index URL. When triggered, it will automatically try to load
		 * indexController.js from your js/controller directory, per convention, allowing you
		 * to save time and reduce amount of boilerplate code you'd normally have to write to
		 * get your route prepared.
		 */
		index: new Butterfly.conventionRoute(),

		/**
		 * Convention route for profile URL
		 */
		profile: new Butterfly.conventionRoute()
	});

	/**
	 * Start listening for route changes
	 */
	window.Router.listen();	
});