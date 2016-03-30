
require "lotus-require"

{ isType, setType } = require "type-utils"
NamedFunction = require "named-function"
ReactiveVar = require "reactive-var"
combine = require "combine"
define = require "define"
sync = require "sync"
has = require "has"

keyPath = []

module.exports =
Store = NamedFunction "Store", (options) ->

  options = combine { frozen: no }, options

  store = (newState) ->

    throw TypeError "'newState' must be an Object literal" unless isType newState, Object

    mergeState store, newState, options

  setType store, null

#
# Helpers
#

mergeState = (state, newState, options) ->

  sync.each newState, (newValue, key) ->

    keyPath.push key

    value = state[key]

    isObject = isType value, Object

    if options.frozen

      if !isObject and has state, key
        throw Error "'#{keyPath.join '.'}' is already defined as a constant."

      else unless newValue?
        throw Error "'#{keyPath.join '.'}' has an undefined value."

    if isType newValue, Object

      unless isObject
        value = {}
        setState state, key, value, options

      mergeState value, newValue, options

      keyPath.pop()

      return

    setState state, key, newValue, options

    keyPath.pop()

    return

setState = (state, key, newValue, options) ->

  # Passing 'undefined' is effectively a no-op.
  return if newValue is undefined

  if options.frozen
    define state, key,
      frozen: yes
      value: newValue

  else if has state, key
    state[key] = newValue

  else
    define state, key,
      reactive: yes
      value: newValue
