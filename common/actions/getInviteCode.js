import {getGraphQLFetcher} from 'src/common/util'

export const GET_INVITE_CODE_REQUEST = 'GET_INVITE_CODE_REQUEST'
export const GET_INVITE_CODE_SUCCESS = 'GET_INVITE_CODE_SUCCESS'
export const GET_INVITE_CODE_FAILURE = 'GET_INVITE_CODE_FAILURE'

function getInviteCodeRequest(code) {
  return {type: GET_INVITE_CODE_REQUEST, code}
}

function getInviteCodeSuccess(code, inviteCode) {
  return {type: GET_INVITE_CODE_SUCCESS, code, inviteCode}
}

function getInviteCodeFailure(code, error) {
  return {type: GET_INVITE_CODE_FAILURE, code, error}
}

export default function getInviteCode(code) {
  return (dispatch, getState) => {
    dispatch(getInviteCodeRequest(code))

    const query = {
      query: `
query ($code: String!) {
  getInviteCodeByCode(code: $code) {
    id
    code
    description
  }
}
      `,
      variables: {
        code,
      },
    }
    const {auth} = getState()

    return getGraphQLFetcher(dispatch, auth)(query)
      .then(result => {
        dispatch(getInviteCodeSuccess(code, result.data.getInviteCodeByCode))
      })
      .catch(error => {
        dispatch(getInviteCodeFailure(code, error))
      })
  }
}
