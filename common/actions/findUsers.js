import {getGraphQLFetcher} from 'src/common/util'

export const FIND_USERS_REQUEST = 'FIND_USERS_REQUEST'
export const FIND_USERS_SUCCESS = 'FIND_USERS_SUCCESS'
export const FIND_USERS_FAILURE = 'FIND_USERS_FAILURE'

export default function findUsers() {
  return (dispatch, getState) => {
    dispatch({type: FIND_USERS_REQUEST})

    const query =
      {
        query:
        ` query {
            findUsers {
              id
              name
              handle
              email
              active
              avatarUrl
              profileUrl
            }
          }
        `
      }

    const {auth} = getState()

    return getGraphQLFetcher(dispatch, auth)(query)
      .then(result => {
        dispatch({type: FIND_USERS_SUCCESS, users: result.data.findUsers})
      })
      .catch(error => {
        dispatch({type: FIND_USERS_FAILURE, error})
      })
  }
}
