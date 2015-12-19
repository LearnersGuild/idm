import _ from 'lodash'


export function buildWhereForParams(params) {
  if (Object.keys(params).length === 0) {
    return { clause: '', values: [] }
  }
  const [columns, values] = _.unzip(_.pairs(params))
  const comparisons = _.map(columns, (column, i) => `${column} = \$${i + 1}`)
  const andedComparisons = comparisons.join(' AND ')
  return {
    clause: `WHERE ${andedComparisons}`,
    values,
  }
}
