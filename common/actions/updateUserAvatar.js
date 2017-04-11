import {getGraphQLFetcher} from 'src/common/util'

export const UPDATE_USER_AVATAR_REQUEST = 'UPDATE_USER_AVATAR_REQUEST'
export const UPDATE_USER_AVATAR_SUCCESS = 'UPDATE_USER_AVATAR_SUCCESS'
export const UPDATE_USER_AVATAR_FAILURE = 'UPDATE_USER_AVATAR_FAILURE'

function updateUserAvatarRequest() {
  return {type: UPDATE_USER_AVATAR_REQUEST}
}

export function updateUserAvatarSuccess(currentUser) {
  return {type: UPDATE_USER_AVATAR_SUCCESS, currentUser}
}

function updateUserAvatarFailure(error) {
  return {type: UPDATE_USER_AVATAR_FAILURE, error}
}

export default function updateUserAvatar(base64ImgData) {
  return (dispatch, getState) => {
    dispatch(updateUserAvatarRequest())

    const mutation = {
      query: `
mutation ($base64ImgData: String!) {
  updateUserAvatar(base64ImgData: $base64ImgData) {
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
      variables: {base64ImgData},
    }
    const {auth} = getState()

    return getGraphQLFetcher(dispatch, auth)(mutation)
      .then(result => {
        dispatch(updateUserAvatarSuccess(result.data.updateUserAvatar))
      })
      .catch(error => {
        dispatch(updateUserAvatarFailure(error))
      })
  }
}
