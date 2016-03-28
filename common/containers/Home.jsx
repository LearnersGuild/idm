/* eslint-disable no-undef */
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import HomeComponent from '../components/Home'

export class Home extends Component {
  constructor(props) {
    super(props)
    this.handleSignOut = this.handleSignOut.bind(this)
    this.handleGraphiQL = this.handleGraphiQL.bind(this)
  }

  handleSignOut() {
    /* global __CLIENT__ */
    if (__CLIENT__) {
      window.location.href = '/auth/sign-out'
    }
  }

  handleGraphiQL() {
    this.props.dispatch(push('/graphiql'))
  }

  render() {
    return (
      <HomeComponent onSignOut={this.handleSignOut} onGraphiQL={this.handleGraphiQL}/>
    )
  }
}

Home.propTypes = {
  children: PropTypes.any,
  dispatch: PropTypes.func.isRequired,
}

export default connect()(Home)
