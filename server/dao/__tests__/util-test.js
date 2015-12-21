/* eslint-disable no-undef */

jest.dontMock('lodash')
jest.dontMock('../util')

const _ = require('lodash')
const util = require('../util')

describe('util', () => {
  describe('buildWhereForParams', () => {
    it('returns an empty array when there are no params', () => {
      const expected = { clause: '', values: [] }

      let actual = util.buildWhereForParams({})
      expect(_.isEqual(expected, actual)).toEqual(true)

      actual = util.buildWhereForParams(null)
      expect(_.isEqual(expected, actual)).toEqual(true)
    })

    it('returns an ANDed WHERE clause using each parameter', () => {
      const expected = {
        clause: 'WHERE foo = $1 AND baz = $2',
        values: [ 'bar', 'qux' ],
      }
      const actual = util.buildWhereForParams({ foo: 'bar', baz: 'qux' })
      expect(_.isEqual(expected, actual)).toEqual(true)
    })
  })
})
