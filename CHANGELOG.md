# Butterfly Framework changelog

## 1.0.4 beta (10th Nov 2014)
* New JS object – `Butterfly.pubsub`
 * Pubsub is a simple way to subscribe and publish events accross your application
* Added a basic browser detection function whose results are integrated into `Butterfly.ready` callback in form of arguments
* Added an internal function for generating a unique alphanumeric identifiers
* Corrected a bug in `Butterfly.router` where an improper data context was used when calling a `destroy` function on a `Butterfly.controller`

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