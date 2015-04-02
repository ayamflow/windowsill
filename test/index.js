'use strict';

var test = require('tape'),
    windowsill = require('../src/index.js');

test('windowsill init', function (assert) {
    assert.plan(10);

    assert.ok(windowsill.resizer, 'Resizer exists on windowsill.');
    assert.ok(windowsill.resizer.addListener, 'Resizer addListener method exists on windowsill.');
    assert.ok(windowsill.scroller, 'Scroller exist on windowsill.');
    assert.ok(windowsill.scroller.addListener, 'Scroller addListener method exists on windowsill.');

    assert.notOk(windowsill.resizer.bound, 'resizer should not be bound after init.');

    windowsill.enable('resizer');
    windowsill.enable('scroller');

    assert.ok(windowsill.resizer.bound, 'resizer should be bound after enable() call.');

    var resized = false;
    windowsill.resizer.addListener(function() {
        resized = true;
        assert.deepEqual(resized, true, 'Resizer event properly triggered.');
    });
    triggerEvent(window, 'resize');

    var scrolled = false;
    windowsill.scroller.addListener(function() {
        scrolled = true;
        assert.deepEqual(scrolled, true, 'Scroller event properly triggered.');
    });
    triggerEvent(window, 'scroll');

    var beforeCalled = false,
        afterCalled = false;

    var resizer = windowsill('resize', {
        debounce: 1,
        beforeEvent: function() {
            beforeCalled = true;
            assert.deepEqual(beforeCalled, true, 'Before callback properly triggered.');
        },

        afterEvent: function() {
            afterCalled = true;
            assert.deepEqual(afterCalled, true, 'After callback properly triggered.');
        }
    });
    resizer.bind();

    triggerEvent(window, 'resize');
});

test('windowsill cleanup', function (assert) {
    var resizer = windowsill.resizer;
    resizer.addListener(function() {});
    assert.ok(resizer._emitter.e.resize, 'We should have some listener registered');
    resizer.unbind();
    assert.notOk(resizer._emitter.e.resize, 'All listeners should be removed.');
});

function triggerEvent(el, eventName) {
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent(eventName, true, false);
    el.dispatchEvent(evt);
}
