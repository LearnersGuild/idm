import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import getInviteCode from '../actions/getInviteCode'
import SignUp from '../components/SignUp'

class SignUpContainer extends Component {
  constructor(props) {
    super(props)
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

  handleSubmitCode(code) {
    this.props.dispatch(getInviteCode(code))
    this.props.dispatch(push(`/sign-up/${code}`))
  }

  render() {
    const {auth, inviteCodes, params: {code}} = this.props

    return (
      <SignUp auth={auth} inviteCodes={inviteCodes} code={code} onSubmitCode={this.handleSubmitCode}/>
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
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
    inviteCodes: state.inviteCodes,
  }
}

export default connect(mapStateToProps)(SignUpContainer)
