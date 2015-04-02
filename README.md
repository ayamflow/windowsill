windowsill
====

Abstract, debounced windows events.
Allow you to listen to an event emitter rather than to the DOM.


## Installation
`npm i windowsill --save`

`component install ayamflow/windowsill`

## API
### windowsill(event, opts)
Factory returning a sill object (event emitter responding to the provided `event`).
* event: a string-based window event, such as 'scroll', 'resize', ...
* opts:
    * *debounce*: debounce delay for the event
    * *props*: hash of window properties to inherit (see example)
    * *beforeEvent*: callback called before emitting the event
    * *afterEvent*: callback called after emitting the event

### windowsill.enable(sillName)
Bind the requested sill on window. (available for `resizer` and `scroller`).
*Since sill object are deactivated by default, you have to call this method to enable `resizer` and `scroller`.*

### windowsill.disable(sillName)
Unbind the requested sill.

### sill object API
* *addListener(cb)*
* *removeListener(cb)*
* *bind*: attach the event to the DOM
* *unbind*: detach the event from the DOM & remove all listeners from the sill object
* *onEvent(event)*: manually trigger the sill update. You can pass an event-like object if you want to set some properties, or just let it parse (if possible) those properties from the `window` object.

### Example

```
var scroller = windowsill('scroll', {
    debounce: 50,
    props: {
        x: 'pageXOffset', // (1)
        y: 'pageYOffset',
        dx: 0, // (2)
        dy: 0,
        ox: 0,
        oy: 0,
        beforeEvent: function(sill, event) { // (3)
            sill.ox = sill.x;
            sill.oy = sill.y;
        },
        afterEvent: function(sill, event) {
            sill.dx = sill.x - sill.ox;
            sill.dy = sill.y - sill.oy;
        }
    }
});

scroller.addListener(this.onScroll);
scroller.onEvent();

scroller.unbind(); // unbind event from window & clear all listeners.
```

* *(1)* you can link a window property to the sill object by passing it as a string. `scroller.x` will be set to `window.pageXOffset` on each event.
* *(2)* you can also pass additionnal properties as non-string, mostly to give initial values.
* *(3)* you can pass `beforeEvent` and `afterEvent` callbacks, which will be called respectively before and after the event is emitted. The sill reference and the event are passed as parameters to those callbacks.

By default, `scroll` and `resize` are already available as `windowsill.resizer` and `windowsill.scroller`, with default debounce time (see [events.js](https://github.com/ayamflow/windowsill/blob/master/src/events.js) for more details).
This allows to bind all window events to a global abstract object:

```
var windowsill = require('windowsill'),
    resizer = windowsill.resizer;

resizer.addListener(function(event) {
    console.log('resize event', event);
});
```