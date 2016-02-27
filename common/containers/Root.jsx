/* eslint-disable no-undef */
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import AppBar from 'material-ui/lib/app-bar'
import LeftNav from 'material-ui/lib/left-nav'
import MenuItem from 'material-ui/lib/menus/menu-item'

import styles from './Root.scss'

export class Root extends Component {
  constructor(props) {
    super(props)
    this.state = {open: false}
    this.handleToggle = this.handleToggle.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleHome = this.handleHome.bind(this)
    this.handleSignUp = this.handleSignUp.bind(this)
    this.handleGraphQL = this.handleGraphQL.bind(this)
  }

  handleToggle() {
    this.setState({open: !this.state.open})
  }

  handleClose() {
    this.setState({open: false})
  }

  handleHome() {
    this.props.dispatch(push('/'))
  }

  handleSignUp() {
    this.handleClose()
    this.props.dispatch(push('/sign-up'))
  }

  handleGraphQL() {
    this.handleClose()
    this.props.dispatch(push('/graphiql'))
  }

  render() {
    const {children} = this.props

    return (
      <section>
        <LeftNav
          docked={false}
          open={this.state.open}
          onRequestChange={this.handleClose}
          >
          <MenuItem onTouchTap={this.handleSignUp}>Sign-Up</MenuItem>
          <MenuItem onTouchTap={this.handleGraphQL}>View GraphiQL</MenuItem>
        </LeftNav>
        <AppBar
          title="Identity Management"
          titleStyle={{cursor: 'pointer'}}
          onLeftIconButtonTouchTap={this.handleToggle}
          onTitleTouchTap={this.handleHome}
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
