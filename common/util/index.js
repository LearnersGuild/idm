import fetch from 'isomorphic-fetch'

import {updateJWT} from '../actions/updateJWT'

export function phoneToE164(phone) {
  if (!phone) {
    return phone
  }
  const phoneStr = phone.toString()
  return `+1 (${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(6)}`
}

export function formatPhoneNumber(phone) {
  if (!phone) {
    return phone
  }
  const phoneDigits = phone.toString().replace(/\D/g, '')
  const areaCode = phoneDigits.slice(0, 3)
  const prefix = phoneDigits.slice(3, 6)
  const suffix = phoneDigits.slice(6, 10)
  let formatted = String(areaCode)
  if (phoneDigits.length > 3) {
    formatted = `(${areaCode}) ${prefix}`
  }
  if (phoneDigits.length > 6) {
    formatted += `-${suffix}`
  }
  return formatted
}

export function getGraphQLFetcher(dispatch, auth, throwErrors = true) {
  return graphQLParams => {
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphQLParams),
    }
    if (auth.lgJWT) {
      options.headers = Object.assign(options.headers, {
        Authorization: `Bearer ${auth.lgJWT}`,
      })
    }

    return fetch('/graphql', options)
      .then(resp => {
        if (!resp.ok) {
          console.error('GraphQL ERROR:', resp.statusText)
          if (throwErrors) {
            throw new Error(`GraphQL ERROR: ${resp.statusText}`)
          }
        }
        // for sliding-sessions, update our JWT from the LearnersGuild-JWT header
        const lgJWT = resp.headers.get('LearnersGuild-JWT')
        if (lgJWT) {
          dispatch(updateJWT(lgJWT))
        }
        return resp.json()
      })
      .then(graphQLResponse => {
        if (graphQLResponse.errors && graphQLResponse.errors.length) {
          if (throwErrors) {
            // throw the first error
            throw new Error(graphQLResponse.errors[0].message)
          }
        }
        return graphQLResponse
      })
  }
}
