# Butterfly Framework changelog

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