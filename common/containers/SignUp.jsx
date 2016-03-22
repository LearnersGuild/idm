import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import updateUser from '../actions/updateUser'
import SignUp from '../components/SignUp'

class SignUpContainer extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(userData) {
    this.props.dispatch(updateUser(userData, '/'))
  }

  render() {
    const {dispatch, auth} = this.props

    return (
      <SignUp onSubmit={this.handleSubmit} auth={auth}/>
    )
  }
}

SignUpContainer.propTypes = {
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

export default connect(mapStateToProps)(SignUpContainer)
