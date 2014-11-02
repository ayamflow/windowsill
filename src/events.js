'use strict';

module.exports = {
    'scroller': {
        eventName: 'scroll',
        opts: {
            debounce: 1000 / 60,
            props: {
                x: 'pageXOffset',
                y: 'pageYOffset'
            },
            immediate: true
        }
    },
    'resizer': {
        eventName: 'resize',
        opts: {
            debounce: 150,
            props: {
                width: 'innerWidth',
                height: 'innerHeight'
            },
            immediate: true
        }
    }
};