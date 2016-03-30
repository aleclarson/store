
# store v0.0.1 [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

```coffee
Store = require "store"
```

### Static Data

`Store` can be used as a static data store.

```coffee
store = Store frozen: yes

store foo: 1

store foo: 2 # This throws an error!
```

### Dynamic Data

`Store` can also be used as a dynamic data store.

A great part about `Store` is the ability to set data using an `Object` literal.

```coffee
store = Store()

store foo: bar: 1

store.foo.bar # 1

store foo: red: 1

store.foo # { bar: 1, red: 1 }
```

### Reactive Data

`Store` uses Meteor's [`ReactiveVar`](https://github.com/aleclarson/reactive-var) to become a reactive data store.

```coffee
store = Store()

Tracker.autorun -> console.log store.foo

# => undefined

store foo: 1

# => 1
```
