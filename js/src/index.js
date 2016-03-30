var NamedFunction, ReactiveVar, Store, combine, define, has, isType, keyPath, mergeState, ref, setState, setType, sync;

require("lotus-require");

ref = require("type-utils"), isType = ref.isType, setType = ref.setType;

NamedFunction = require("named-function");

ReactiveVar = require("reactive-var");

combine = require("combine");

define = require("define");

sync = require("sync");

has = require("has");

keyPath = [];

module.exports = Store = NamedFunction("Store", function(options) {
  var store;
  options = combine({
    frozen: false
  }, options);
  store = function(newState) {
    if (!isType(newState, Object)) {
      throw TypeError("'newState' must be an Object literal");
    }
    return mergeState(store, newState, options);
  };
  return setType(store, null);
});

mergeState = function(state, newState, options) {
  return sync.each(newState, function(newValue, key) {
    var isObject, value;
    keyPath.push(key);
    value = state[key];
    isObject = isType(value, Object);
    if (options.frozen) {
      if (!isObject && has(state, key)) {
        throw Error("'" + (keyPath.join('.')) + "' is already defined as a constant.");
      } else if (newValue == null) {
        throw Error("'" + (keyPath.join('.')) + "' has an undefined value.");
      }
    }
    if (isType(newValue, Object)) {
      if (!isObject) {
        value = {};
        setState(state, key, value, options);
      }
      mergeState(value, newValue, options);
      keyPath.pop();
      return;
    }
    setState(state, key, newValue, options);
    keyPath.pop();
  });
};

setState = function(state, key, newValue, options) {
  if (newValue === void 0) {
    return;
  }
  if (options.frozen) {
    return define(state, key, {
      frozen: true,
      value: newValue
    });
  } else if (has(state, key)) {
    return state[key] = newValue;
  } else {
    return define(state, key, {
      reactive: true,
      value: newValue
    });
  }
};

//# sourceMappingURL=../../map/src/index.map
