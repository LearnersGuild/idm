import {runQuery} from './graphql'

export async function assertQueryError(t, api, errorMsg, query, params, rootQuery) {
  t.plan(2)
  const result = runQuery(query, api, params, rootQuery)
  const error = await t.throws(result)
  t.true(error.message.includes(errorMsg))
}
