/* eslint-disable no-undef */
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {pushPath} from 'redux-simple-router'

import AppBar from 'material-ui/lib/app-bar'
import LeftNav from 'material-ui/lib/left-nav'
import MenuItem from 'material-ui/lib/menus/menu-item'

import styles from './Root.scss'

export class Root extends Component {
  constructor(props) {
    super(props)
    this.state = {open: false}
  }

  handleToggle() {
    this.setState({open: !this.state.open})
  }

  handleClose() {
    this.setState({open: false})
  }

  handleHome() {
    this.props.dispatch(pushPath('/'))
  }

  handleSignUp() {
    this.handleClose()
    this.props.dispatch(pushPath('/sign-up'))
  }

  handleGraphQL() {
    window.location = '/graphql'
  }

  render() {
    const {children} = this.props

    return (
      <section>
        <LeftNav
          docked={false}
          open={this.state.open}
          onRequestChange={open => this.setState({open})}
          >
          <MenuItem onTouchTap={this.handleSignUp.bind(this)}>Sign-Up</MenuItem>
          <MenuItem onTouchTap={this.handleGraphQL.bind(this)}>View GraphiQL</MenuItem>
        </LeftNav>
        <AppBar
          title="Identity Management"
          titleStyle={{cursor: 'pointer'}}
          onLeftIconButtonTouchTap={this.handleToggle.bind(this)}
          onTitleTouchTap={this.handleHome.bind(this)}
          />
        <div className={styles.layout}>{children}</div>
      </section>
    )
  }
}

Root.propTypes = {
  auth: PropTypes.shape({
    isSigningIn: PropTypes.bool.isRequired,
    currentUser: PropTypes.object,
  }),
  children: PropTypes.any,
  dispatch: PropTypes.func,
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  }
}

export default connect(mapStateToProps)(Root)
