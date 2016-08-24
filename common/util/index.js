import fetch from 'isomorphic-fetch'

import {updateJWT} from 'src/common/actions/updateJWT'

export * from './phoneNumber'

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
          return resp.json().then(errorResponse => {
            throw errorResponse
          })
        }

        // for sliding-sessions, update our JWT from the LearnersGuild-JWT header
        const lgJWT = resp.headers.get('LearnersGuild-JWT')
        if (lgJWT) {
          dispatch(updateJWT(lgJWT))
        }

        return resp.json()
      })
      .then(graphQLResponse => {
        if (graphQLResponse.errors) {
          throw graphQLResponse
        }

        return graphQLResponse
      })
      .catch(err => {
        if (err && err.errors && err.errors.length) {
          if (throwErrors) {
            throw new Error(err.errors[0].message)
          }

          console.error('GraphQL ERRORS:', err.errors)
        }

        console.error('GraphQL ERROR:', err)
      })
  }
}

export function buildURL(baseURL, queryArgs) {
  const queryStr = Object.keys(queryArgs || {}).reduce((args, key) => {
    const val = queryArgs[key]
    if (val) {
      args.push(`${key}=${encodeURIComponent(val)}`)
    }
    return args
  }, []).join('&')
  const search = queryStr ? `?${queryStr}` : ''
  return `${baseURL}${search}`
}
