'use strict'

var setPrototypeOf = require('./index.js')

// Benchmark configuration
var ITERATIONS = 1000000
var WARMUP = 100000

// Test scenarios
function benchmark (name, fn) {
  // Warmup
  for (var i = 0; i < WARMUP; i++) {
    fn()
  }

  // Actual benchmark
  var start = Date.now()
  for (var j = 0; j < ITERATIONS; j++) {
    fn()
  }
  var end = Date.now()
  var duration = (end - start) / 1000
  var opsPerSec = Math.round(ITERATIONS / duration)

  console.log(name + ': ' + opsPerSec.toLocaleString() + ' ops/sec (' + duration.toFixed(2) + 's)')
}

console.log('setPrototypeOf Performance Benchmark')
console.log('=====================================')
console.log('Iterations: ' + ITERATIONS.toLocaleString())
console.log('')

// Scenario 1: Simple object with Object.prototype
benchmark('Simple object (Object.prototype)', function () {
  var obj = { a: 1 }
  setPrototypeOf(obj, Object.prototype)
})

// Scenario 2: Simple object with Array.prototype
benchmark('Simple object (Array.prototype)', function () {
  var obj = { a: 1 }
  setPrototypeOf(obj, Array.prototype)
})

// Scenario 3: Object with custom prototype (small)
var smallProto = { x: 1, y: 2, z: 3 }
benchmark('Custom prototype (3 properties)', function () {
  var obj = { a: 1 }
  setPrototypeOf(obj, smallProto)
})

// Scenario 4: Object with custom prototype (medium)
var mediumProto = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10 }
benchmark('Custom prototype (10 properties)', function () {
  var obj = { x: 1 }
  setPrototypeOf(obj, mediumProto)
})

// Scenario 5: Object with custom prototype (large)
var largeProto = {}
for (var k = 0; k < 50; k++) {
  largeProto['prop' + k] = k
}
benchmark('Custom prototype (50 properties)', function () {
  var obj = { x: 1 }
  setPrototypeOf(obj, largeProto)
})

// Scenario 6: Repeated prototype (cache hit test)
var repeatedProto = { foo: 'bar', baz: 'qux' }
benchmark('Repeated prototype (cache test)', function () {
  var obj = { a: 1 }
  setPrototypeOf(obj, repeatedProto)
})

// Scenario 7: Function prototype
benchmark('Function prototype', function () {
  var obj = { a: 1 }
  setPrototypeOf(obj, Function.prototype)
})

// Scenario 8: Null prototype
benchmark('Null prototype', function () {
  var obj = { a: 1 }
  setPrototypeOf(obj, null)
})

// Scenario 9: Mixed object types
var counter = 0
benchmark('Mixed object types', function () {
  var obj = counter % 2 === 0 ? { a: 1 } : { b: 2, c: 3 }
  var proto = counter % 3 === 0 ? Object.prototype : (counter % 3 === 1 ? Array.prototype : smallProto)
  setPrototypeOf(obj, proto)
  counter++
})

console.log('')
console.log('Benchmark completed')
