import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import updateUser from '../actions/updateUser'
import SignUp from '../components/SignUp'

function signUp({dispatch, auth}) {
  const handleSubmit = userData => {
    dispatch(updateUser(userData, '/'))
  }

  return (
    <SignUp onSubmit={handleSubmit} auth={auth}/>
  )
}

signUp.propTypes = {
  auth: PropTypes.shape({
    isSigningIn: PropTypes.bool.isRequired,
    currentUser: PropTypes.object,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  }
}

export default connect(mapStateToProps)(signUp)
