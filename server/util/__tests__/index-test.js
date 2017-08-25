import test from 'ava'
import {first} from '../index'

let counter = 0
let returnedValue = null
const collection = ['one', 'two', 'three', 'four', 'five']
const iteratorFn = value => {
  if (counter === 3) {
    returnedValue = value
    return true
  }
  counter++
}

test('first() takes a collection and passes each item into the iteratorFn().', async t => {
  const result = await first(collection, iteratorFn)

  t.is(counter, 3, 'iteratorFn() was called the incorrect amount of times.')
  t.true(result, 'first() did not return true.')
  t.is(returnedValue, collection[3], 'first() returned unexpected value from collection.')
})
