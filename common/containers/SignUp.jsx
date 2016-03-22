import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import getInviteCode from '../actions/getInviteCode'
import updateUser from '../actions/updateUser'
import SignUp from '../components/SignUp'

class SignUpContainer extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    this.constructor.fetchData(this.props)
  }

  static fetchData(props) {
    const {dispatch, params: {code}} = props
    if (code) {
      dispatch(getInviteCode(code))
    }
  }

  handleSubmit(userData) {
    this.props.dispatch(updateUser(userData, '/'))
  }

  render() {
    const {auth, inviteCodes, params: {code}} = this.props

    return (
      <SignUp onSubmit={this.handleSubmit} auth={auth} inviteCodes={inviteCodes} code={code}/>
    )
  }
}

SignUpContainer.propTypes = {
  auth: PropTypes.shape({
    isSigningIn: PropTypes.bool.isRequired,
    currentUser: PropTypes.object,
  }).isRequired,
  inviteCodes: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    codes: PropTypes.object.isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
    inviteCodes: state.inviteCodes,
  }
}

export default connect(mapStateToProps)(SignUpContainer)
