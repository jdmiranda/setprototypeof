'use strict'
/* eslint no-proto: 0 */

// Performance optimizations
var nativeSetPrototypeOf = typeof Object.setPrototypeOf === 'function' ? Object.setPrototypeOf : null
var supportsProto = { __proto__: [] } instanceof Array
var descriptorCache = typeof WeakMap !== 'undefined' ? new WeakMap() : null
var commonPrototypes = typeof WeakMap !== 'undefined' ? new WeakMap() : null

// Pre-cache common prototypes for fast path detection
if (commonPrototypes) {
  try {
    commonPrototypes.set(Object.prototype, true)
    commonPrototypes.set(Array.prototype, true)
    commonPrototypes.set(Function.prototype, true)
  } catch (e) {
    // WeakMap not fully supported
    commonPrototypes = null
  }
}

module.exports = nativeSetPrototypeOf || (supportsProto ? setProtoOf : mixinProperties)

function setProtoOf (obj, proto) {
  obj.__proto__ = proto
  return obj
}

function mixinProperties (obj, proto) {
  // Fast path for common prototypes
  if (commonPrototypes && commonPrototypes.has(proto)) {
    return mixinPropertiesFast(obj, proto)
  }

  // Check descriptor cache
  var cachedDescriptors = descriptorCache ? descriptorCache.get(proto) : null

  if (cachedDescriptors) {
    // Use cached descriptors for faster property copying
    for (var i = 0; i < cachedDescriptors.length; i++) {
      var prop = cachedDescriptors[i]
      if (!Object.prototype.hasOwnProperty.call(obj, prop)) {
        obj[prop] = proto[prop]
      }
    }
  } else {
    // Build descriptor cache while copying
    var props = []
    for (var key in proto) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) {
        obj[key] = proto[key]
      }
      props.push(key)
    }

    // Cache for next time
    if (descriptorCache && props.length > 0) {
      try {
        descriptorCache.set(proto, props)
      } catch (e) {
        // Cache failed, continue without caching
      }
    }
  }

  return obj
}

function mixinPropertiesFast (obj, proto) {
  // Fast path for common prototypes - no caching needed
  for (var prop in proto) {
    if (!Object.prototype.hasOwnProperty.call(obj, prop)) {
      obj[prop] = proto[prop]
    }
  }
  return obj
}
