import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import authenticate from 'src/common/actions/authenticate'
import getInviteCode from 'src/common/actions/getInviteCode'
import SignUp from 'src/common/components/SignUp'
import {buildURL} from 'src/common/util'

class SignUpContainer extends Component {
  constructor(props) {
    super(props)
    this.handleAuthenticate = this.handleAuthenticate.bind(this)
    this.handleSubmitCode = this.handleSubmitCode.bind(this)
  }

  componentDidMount() {
    this.constructor.fetchData(this.props.dispatch, this.props)
  }

  static fetchData(dispatch, props) {
    const {params: {code}} = props
    if (code) {
      dispatch(getInviteCode(code))
    }
  }

  handleAuthenticate(authURL) {
    this.props.dispatch(authenticate(authURL))
  }

  handleSubmitCode(code) {
    const {
      location: {query: {redirect, responseType}},
    } = this.props
    const signUpLinkWithCode = buildURL(`/sign-up/${code}`, {redirect, responseType})
    this.props.dispatch(getInviteCode(code))
    this.props.dispatch(push(signUpLinkWithCode))
  }

  render() {
    const {params: {code}} = this.props

    return (
      <SignUp code={code}
        onAuthenticate={this.handleAuthenticate}
        onSubmitCode={this.handleSubmitCode}
        {...this.props}
        />
    )
  }
}

SignUpContainer.propTypes = {
  auth: PropTypes.shape({
    isBusy: PropTypes.bool.isRequired,
    currentUser: PropTypes.object,
  }).isRequired,
  inviteCodes: PropTypes.shape({
    isBusy: PropTypes.bool.isRequired,
    codes: PropTypes.object.isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  location: PropTypes.shape({
    query: PropTypes.object.isRequired,
  }),
}

export default connect(state => ({
  auth: state.auth,
  inviteCodes: state.inviteCodes,
}))(SignUpContainer)
