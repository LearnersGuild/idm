import {push} from 'react-router-redux'

import {graphQLFetchPost} from '../util'

export const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST'
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS'
export const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE'

function updateUserRequest() {
  return {type: UPDATE_USER_REQUEST}
}

function updateUserSuccess(currentUser) {
  return {type: UPDATE_USER_SUCCESS, currentUser}
}

function updateUserFailure(error) {
  return {type: UPDATE_USER_FAILURE, error}
}

export default function updateUser(userData, successPath) {
  return (dispatch, getState) => {
    dispatch(updateUserRequest())

    const mutation = {
      query: `
mutation ($user: InputUser!) {
  updateUser(user: $user) {
    id
    email
    handle
    name
    emails
    phone
    dateOfBirth
    timezone
    roles
    authProviders {
      githubOAuth2 {
        accessToken
      }
    }
  }
}
      `,
      variables: {
        user: userData,
      },
    }
    const {currentUser} = getState().auth

    return graphQLFetchPost(currentUser, mutation)
      .then(result => {
        dispatch(updateUserSuccess(result.data.updateUser))
        if (successPath) {
          dispatch(push(successPath))
        }
      })
      .catch(error => {
        dispatch(updateUserFailure(error))
      })
  }
}
