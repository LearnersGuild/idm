/* global __CLIENT__, window */
import {connect} from 'react-redux'

import signIn from '../actions/signIn'
import SignIn from '../components/SignIn'

function getNextFromUrl() {
  return __CLIENT__ && window.location.search ? window.location.search.match(/next=(.*)$/)[1] : null
}

function mapDispatchToProps(dispatch) {
  return {
    onSignIn: () => dispatch(signIn('google-oauth2', getNextFromUrl()))
  }
}

export default connect(null, mapDispatchToProps)(SignIn)
