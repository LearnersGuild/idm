/* global __CLIENT__ */
/* eslint-disable no-undef */
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import HomeComponent from 'src/common/components/Home'
import userCan from 'src/common/util/userCan'

export class Home extends Component {
  constructor(props) {
    super(props)
    this.handleClickEditProfileButton = this.handleClickEditProfileButton.bind(this)
    this.handleClickSignOutButton = this.handleClickSignOutButton.bind(this)
    this.handleClickUsersButton = this.handleClickUsersButton.bind(this)
  }

  handleClickEditProfileButton() {
    this.props.dispatch(push('/profile'))
  }

  handleClickSignOutButton() {
    if (__CLIENT__) {
      window.location.href = '/auth/sign-out'
    }
  }

  handleClickUsersButton() {
    if (__CLIENT__) {
      window.location.href = '/users'
    }
  }

  render() {
    const {currentUser} = this.props
    const canViewUsers = userCan(currentUser, 'viewAllUsers')
    return (
      <HomeComponent
        onClickEditProfileButton={this.handleClickEditProfileButton}
        onClickSignOutButton={this.handleClickSignOutButton}
        onClickUsersButton={this.handleClickUsersButton}
        showUsers={canViewUsers}
        />
    )
  }
}

function mapStateToProps(state) {
  const {auth} = state
  const {currentUser} = auth
  return {currentUser}
}

Home.propTypes = {
  currentUser: PropTypes.object.isRequired,
  children: PropTypes.any,
  dispatch: PropTypes.func.isRequired,
}

export default connect(
  mapStateToProps
)(Home)
