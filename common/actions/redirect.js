import {push} from 'react-router-redux'

import {buildURL} from 'src/common/util'

export default function redirect(redirect, responseType) {
  return (dispatch, getState) => {
    const {auth: {lgJWT}} = getState()

    const redirectLocation = redirect || '/'
    if (redirectLocation.match(/^\//)) {
      dispatch(push(redirectLocation))
    } else {
      const redirectURL = responseType === 'token' ? buildURL(decodeURIComponent(redirectLocation), {lgJWT}) : redirectLocation
      /* global __CLIENT__, window */
      if (__CLIENT__) {
        window.location.href = redirectURL
      }
    }
  }
}
