# Butterfly Framework changelog

## 1.0.6 beta (21st Nov 2014)
* New feature - `Butterfly.property` binding to a jQuery object
* New feature - `Butterfly.model` HTML binding
* New feature - `Butterfly.model` JSON two way binding 
* Bug fixes:
 * Fixed issue on controller object where initialize function was triggered more than once (up to three times) causing major app slowdown
 * Corrected issue when `modules` function was fetching all HTML files twice, causing performance issues
 * Improved responsive layout system by adjusting code and SCSS files
 * Fixed critical behavior of cache watchdog which was removing non-cache items from `localStorage`
 * Removed support for jQuery objects from templating function
* Router is now calling 'destroy' function on sub-controllers (sub-controller reference has to be stored into main controller)
* Dialog UI improvements and bug fixes
* Navigation bar UI improvements and bug fixes
* Responsive layout system is improved

## 1.0.5 beta (13th Nov 2014)
* New jQuery plugin – `tooltip` (initial features)
 * A simple way to display a stylish instead of a plain default tooltip 
 * Ability to specify tooltip orientation via initialization options
* Added possibility to tell Butterfly to pick up all elements with `title` attribute and to apply `tooltip` plugin on them (default is `false`)

## 1.0.4 beta (10th Nov 2014)
* New JS object – `Butterfly.pubsub`
 * Pubsub is a simple way to subscribe and publish events accross your application
* Added a basic browser detection function whose results are integrated into `Butterfly.ready` callback in form of arguments
* Added an internal function for generating a unique alphanumeric identifiers
* Corrected a bug in `Butterfly.router` where an improper data context was used when calling a `destroy` function on a `Butterfly.controller`

## 1.0.3 beta (9th Nov 2014)
* New CSS component – Dropdown menu
 * Currently fully supported only when placed within `ul.navigation`
 * Mobile friendly mode supported
 * No support for nested dropdown menus
* Implemented dropdown support code in `butterfly.js`
* Added `scss/_menu.scss` to the project
* Implemented CSS for applying styled border to `img` elements by adding `.border` class to them
* Added an option of disabling navigation responsiveness by adding `.navigation-desktop` class to the `ul.navigation` tag

## 1.0.2 beta (8th Nov 2014)
* New CSS component – Button Group 
 * Added support for stacking buttons within `<div class="button-group">` in either horizontal or vertical fashion 
 * Added support for horizontally stacked responsive button groups
* Corrected an issue where billboard component was consuming CSS `background` property to set background color, instead of `background-color`
* Extracted a button border radius setting into `_variables.scss` and changed the value to `5px` (it was `4px`)

## 1.0.1 beta (6th Nov 2014)
* Added version and release information to `Butterfly.prototype`
* Added `convetionRoute` to `Butterfly.prototype`. Convention Route is an object designed to reduce the amount of boilerplate code used to load controllers within app.js or main.js 
* Modified `Butterfly.prototype.router` to handle `Butterfly.prototype.conventionRoute`
* Moved `var Butterfly = function(element, options)` outside of the main closure
* Added this file (CHANGELOG.md) to repository

## 1.0.0 beta (5th Nov 2014)
* AMD engine (Asynchronous Module Definition)
* Router object (for building Single Page Applications) 
* Micro templating engine
* Caching layer
* JavaScript powered responsive layout
* Initial CSS
* Several UI components (dialog, loader, tocspy, sticky)