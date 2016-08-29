import {connect} from 'react-redux'

import SignInComponent from 'src/common/components/SignIn'
import authenticate from 'src/common/actions/authenticate'

function onAuthenticate(dispatch) {
  return authURL => {
    return dispatch(authenticate(authURL))
  }
}

export default connect(state => ({
  isBusy: state.auth.isBusy,
}), dispatch => ({
  onAuthenticate: onAuthenticate(dispatch),
}))(SignInComponent)
