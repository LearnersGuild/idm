/* eslint-disable no-undef */
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import HomeComponent from '../components/Home'

export class Home extends Component {
  constructor(props) {
    super(props)
    this.handleEditProfile = this.handleEditProfile.bind(this)
    this.handleGraphiQL = this.handleGraphiQL.bind(this)
    this.handleSignOut = this.handleSignOut.bind(this)
  }

  handleEditProfile() {
    this.props.dispatch(push('/profile'))
  }

  handleGraphiQL() {
    this.props.dispatch(push('/graphiql'))
  }

  handleSignOut() {
    /* global __CLIENT__ */
    if (__CLIENT__) {
      window.location.href = '/auth/sign-out'
    }
  }

  render() {
    return (
      <HomeComponent onEditProfile={this.handleEditProfile} onGraphiQL={this.handleGraphiQL} onSignOut={this.handleSignOut}/>
    )
  }
}

Home.propTypes = {
  children: PropTypes.any,
  dispatch: PropTypes.func.isRequired,
}

export default connect()(Home)
