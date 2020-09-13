"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactstate = exports.AddState = exports.fromState = exports.connect = exports.unsubscribe = exports.subscribe = exports.deleteState = exports.mutateState = exports.getState = exports.addState = void 0;
var react_1 = require("react");
var state = {};
var subscriptions = {};
exports.addState = function () { return function (key, subState) {
    state[key]
        ? (function () { throw new Error("state[" + key + "] already exists. Please provide a unique key"); })()
        : state[key] = subState;
}; };
exports.getState = function (key) { return state[key]; };
exports.mutateState = function () { return function (key, newState) {
    state[key] = newState;
    Object.keys(subscriptions[key]).forEach(function (subKey) { return subscriptions[key][subKey](newState); });
}; };
exports.deleteState = function (key) { delete state[key]; };
exports.subscribe = function () { return function (key, subKey, fn) {
    subscriptions[key] = subscriptions[key] ? subscriptions[key] : {};
    subscriptions[key][subKey] = fn;
}; };
exports.unsubscribe = function () { return function (key, subKey) {
    delete subscriptions[key][subKey];
}; };
exports.connect = function () { return function (keys, subKey) {
    var states = [];
    var setStates = [];
    keys.forEach(function (key, i) {
        var _a;
        _a = react_1.useState(exports.getState(key)), states[i] = _a[0], setStates[i] = _a[1];
        react_1.useEffect(function () {
            exports.subscribe()(key, subKey, (function (newValue) { setStates[i](newValue); }));
            return function () {
                exports.unsubscribe()(key, subKey);
            };
        });
    });
    return keys.reduce(function (ac, key, i) {
        var _a;
        return (__assign(__assign({}, ac), (_a = {}, _a[key] = states[i], _a)));
    }, {});
}; };
exports.fromState = function () { return function (subKey, keys, subFn) {
    var states = [];
    var setStates = [];
    keys.forEach(function (key, i) {
        var _a;
        _a = react_1.useState(exports.getState(key)), states[i] = _a[0], setStates[i] = _a[1];
        react_1.useEffect(function () {
            exports.subscribe()(key, subKey, (function (newValue) { setStates[i](newValue); }));
            return function () {
                exports.unsubscribe()(key, subKey);
            };
        });
    });
    var partialState = keys.reduce(function (ac, key, i) {
        var _a;
        return (__assign(__assign({}, ac), (_a = {}, _a[key] = states[i], _a)));
    }, {});
    return subFn(partialState);
}; };
exports.AddState = function () { return function (_a) {
    var stateId = _a.id, init = _a.init;
    var state = exports.getState(stateId);
    !state && exports.addState()(stateId, init);
    react_1.useEffect(function () {
        return function () { return exports.deleteState(stateId); };
    });
    return null;
}; };
exports.reactstate = function () { return ({
    AddState: exports.AddState(),
    mutateState: exports.mutateState(),
    connect: exports.connect(),
    fromState: exports.fromState()
}); };
