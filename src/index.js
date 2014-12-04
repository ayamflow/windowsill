'use strict';

var EventEmitter = require('tiny-emitter'),
    debounce = require('debounce'),
    events = require('./events'),
    hasOwnProp = Object.prototype.hasOwnProperty,
    toString = Object.prototype.toString;

/*
    factory function
    return a "sill" object, which is an event emitter responding to the provided event
 */
var windowsill = module.exports = function(eventName, opts) {
    var sill = {
        opts: opts,
        eventName: eventName,
        bound: false,

        _emitter: new EventEmitter(),

        addListener: function(listener) {
            this._emitter.on(eventName, listener);
        },

        removeListener: function(listener) {
            if(listener) this._emitter.off(eventName, listener);
        },

        onEvent: function(event) {
            // call beforeEvent hook
            if(this.opts.beforeEvent) this.opts.beforeEvent(this, event);

            // inherit all properties from the provided `prop` hash.
            // If string, will bind the window[prop] to this[prop]
            // else, will set the provided value
            if(opts.props) {
                var props = opts.props;
                for(var prop in props) {
                    if(hasOwnProp.call(props, prop)) {
                        var inherited = props[prop];
                        if(isString(inherited)) {
                            this[prop] = window[inherited];
                        }
                        else {
                            this[prop] = inherited;
                        }
                    }
                }
            }

            this._emitter.emit(this.eventName, eventName);

            // call beforeEvent hook
            if(this.opts.afterEvent) this.opts.afterEvent(this, event);
        },

        debounced: function() {},

        bind: function() {
            this.bound = true;
            window.addEventListener(this.eventName, this.debounced);
        },

        unbind: function() {
            window.removeEventListener(this.eventName, this.debounced);
            this.bound = false;
        }
    };

    sill.debounced = debounce(sill.onEvent.bind(sill), opts.debounce);

    if(opts.immediate) sill.onEvent();

    return sill;
};

windowsill.enable = function(sillName) {
    var sill = windowsill[sillName];
    if(!sill) return console.log('[windowsill] has no registered sill with the name "' + sillName + '".');
    if(sill.bound) return;
    sill.bind();
};

windowsill.disable = function(sillName) {
    var sill = windowsill[sillName];
    if(!sill) return console.log('[windowsill] has no registered sill with the name "' + sillName + '".');
    if(!sill.bound) return;
    sill.unbind();
};

/*
    Add default listeners for scroll, resize...
 */
for(var prop in events) {
    if(hasOwnProp.call(events, prop)) {
        var sillEvent = events[prop];
        windowsill[prop] = windowsill(sillEvent.eventName, sillEvent.opts);
    }
}

function isString(string) {
    return toString.call(string) === '[object String]';
}