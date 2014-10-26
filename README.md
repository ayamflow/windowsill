windowsill
====

Abstracted, debounced windows events.
Allow you to listen to an event emitter rather than to the DOM.

## API
### windowsill(event, opts)
Factory returning a sill object (event emitter responding to the provided `event`).
* event: a string-based window event, such as 'scroll', 'resize', ...
* opts:
    * debounce: debounce delay for the event
    * props: hash of window properties to inherit (see example)
    * beforeEvent: callback called before emitting the event
    * afterEvent: callabck called after emitting the event

### sill object API
* addListener(cb)
* removeListener(cb)
* bind: attach the event to the DOM (automatically called when using the windowsill factory)
* unbind: detach the event from the DOM

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
        beforeEvent: function() { // (3)
            this.ox = this.x;
            this.oy = this.y;
        },
        afterEvent: function() {
            this.dx = this.x - this.ox;
            this.dy = this.y - this.oy;
        }
    }
});

scroller.addListener(this.onScroll);
```

* *(1)* you can link a window property to the sill object by passing it as a string. scroller.x will be set to window.pageXOffset on each event.
* *(2)* you can also pass additionnal properties as non-string, mostly to give initial values.
* *(3)* you can pass `beforeEvent` and `afterEvent` callbacks, which will be called respectively before and after the event is emitted. Those callbacks will automatically be called with the sill context.

By default, `scroll` and `resize` are already available as `windowsill.resizer` and `windowsill.scroller`, with default debounce time (see events.js for more details).
This allows to bind all window event to a global abstracted object:

```
var windowsill = require('windowsill'),
    resizer = windowsill.resizer;

resizer.addListener(function(event) {
    console.log('resize event', event);
});
```