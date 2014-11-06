# Butterfly Framework changelog

## 1.0.1 beta
* Added version and release information to `Butterfly.prototype`
* Added `convetionRoute` to `Butterfly.prototype`. Convention Route is an object designed to reduce the amount of boilerplate code used to load controllers within app.js or main.js 
* Modified `Butterfly.prototype.router` to handle `Butterfly.prototype.conventionRoute`
* Moved `var Butterfly = function(element, options)` outside of the main closure
* Added this file (CHANGELOG.md) to repository

## 1.0.0 beta
* AMD engine (Asynchronous Module Definition)
* Router object (for building Single Page Applications) 
* Micro templating engine
* Caching layer
* JavaScript powered responsive layout
* Initial CSS
* Several UI components (dialog, loader, tocspy, sticky)