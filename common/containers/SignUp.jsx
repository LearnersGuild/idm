import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import getInviteCode from '../actions/getInviteCode'
import SignUp from '../components/SignUp'

class SignUpContainer extends Component {
  componentDidMount() {
    this.constructor.fetchData(this.props.dispatch, this.props)
  }

  static fetchData(dispatch, props) {
    const {params: {code}} = props
    if (code) {
      dispatch(getInviteCode(code))
    }
  }

  render() {
    const {auth, inviteCodes, params: {code}} = this.props

    return (
      <SignUp auth={auth} inviteCodes={inviteCodes} code={code}/>
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
