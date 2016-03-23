import fetch from 'isomorphic-fetch'

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

export function graphQLFetchPost(currentUser, mutation) {
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mutation),
  }
  if (currentUser && currentUser.lgJWT) {
    options.headers = Object.assign(options.headers, {
      Authorization: `Bearer ${currentUser.lgJWT}`,
    })
  }

  return fetch('/graphql', options)
    .then(resp => {
      if (!resp.ok) {
        console.error('GraphQL ERROR:', resp.statusText)
        throw new Error(`GraphQL ERROR: ${resp.statusText}`)
      }
      return resp.json()
    })
    .then(graphQLResponse => {
      if (graphQLResponse.errors && graphQLResponse.errors.length) {
        // throw the first error
        throw new Error(graphQLResponse.errors[0].message)
      }
      return graphQLResponse
    })
}
