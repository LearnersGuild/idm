/* global __CLIENT__ */
/* eslint-disable no-undef */
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {updateJWT} from 'src/common/actions/updateJWT'
import HomeComponent from 'src/common/components/Home'

export class Home extends Component {
  constructor(props) {
    super(props)
    this.handleEditProfile = this.handleEditProfile.bind(this)
    this.handleSignOut = this.handleSignOut.bind(this)
    this.handleNavigateUsers = this.handleNavigateUsers.bind(this)
  }

  handleEditProfile() {
    this.props.dispatch(push('/profile'))
  }

  handleSignOut() {
    if (__CLIENT__) {
      window.location.href = '/auth/sign-out'
    }
  }

  handleNavigateUsers() {
    if (__CLIENT__) {
      window.location.href = '/users'
    }
  }

  componentDidMount() {
    this.constructor.fetchData(this.props.dispatch, this.props)
  }

  static fetchData(dispatch) {
    dispatch(updateJWT())
  }

  render() {
    const isAdmin = this.props.isAdmin
    return (
      <HomeComponent onEditProfile={this.handleEditProfile} onSignOut={this.handleSignOut} onNavigateUsers={this.handleNavigateUsers} isAdmin={isAdmin}/>
    )
  }
}

function mapStateToProps(state) {
  const {users, auth} = state
  const {isAdmin} = auth
  return {users, isAdmin}
}

Home.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  authData: PropTypes.object.isRequired,
  children: PropTypes.any,
  dispatch: PropTypes.func.isRequired,
}

export default connect(
  mapStateToProps
)(Home)
