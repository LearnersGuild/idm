import {getGraphQLFetcher} from 'src/common/util'

export const FIND_USERS_REQUEST = 'FIND_USERS_REQUEST'
export const FIND_USERS_SUCCESS = 'FIND_USERS_SUCCESS'
export const FIND_USERS_FAILURE = 'FIND_USERS_FAILURE'

function findUsersRequest() {
  return {type: FIND_USERS_REQUEST}
}

function findUsersSuccess(users) {
  return {type: FIND_USERS_SUCCESS, users}
}

function findUsersFailure(error) {
  return {type: FIND_USERS_FAILURE, error}
}

export default function findUsers() {
  return (dispatch, getState) => {
    dispatch(findUsersRequest())

    const query =
    {
      query:
      ` query {
          findUsers {
            id
            name
            handle
            email
          }
        }
      `
    }

    const {auth} = getState()

    return getGraphQLFetcher(dispatch, auth)(query)
      .then(result => {
        // console.log('graphQL action query result', result)
        dispatch(findUsersSuccess(result.data.findUsers))
      })
      .catch(error => {
        dispatch(findUsersFailure(error))
      })
  }
}
