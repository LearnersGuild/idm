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
  return fetch('/graphql', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser.idToken}`,
    },
    body: JSON.stringify(mutation),
  })
}
