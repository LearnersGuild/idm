/* eslint-disable no-undef */
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import AppBar from 'react-toolbox/lib/app_bar'
import {Button, IconButton} from 'react-toolbox/lib/button'
import Drawer from 'react-toolbox/lib/drawer'
import Navigation from 'react-toolbox/lib/navigation'
import {MenuItem} from 'react-toolbox'

import Errors from './Errors'

import styles from './FramedLayout.scss'

export class FramedLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {drawerOpen: false}
    this.handleToggle = this.handleToggle.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleHome = this.handleHome.bind(this)
    this.handleSignOut = this.handleSignOut.bind(this)
    this.handleGraphQL = this.handleGraphQL.bind(this)
  }

  handleToggle() {
    this.setState({drawerOpen: !this.state.drawerOpen})
  }

  handleClose() {
    this.setState({drawerOpen: false})
  }

  handleHome() {
    this.props.dispatch(push('/'))
  }

  handleSignOut() {
    this.handleClose()
    // this.props.dispatch(push('/sign-out'))
    /* eslint-disable no-alert */
    alert('Not implemented!')
  }

  handleGraphQL() {
    this.handleClose()
    this.props.dispatch(push('/graphiql'))
  }

  render() {
    const {children} = this.props

    return (
      <section>
        <Drawer
          docked={false}
          active={this.state.drawerOpen}
          onOverlayClick={this.handleClose}
          >
          <Navigation type="vertical">
            <MenuItem onClick={this.handleSignOut} caption="Sign Out"/>
            <MenuItem onClick={this.handleGraphQL} caption="View GraphiQL"/>
          </Navigation>
        </Drawer>
        <AppBar flat>
          <IconButton inverse icon="menu" onClick={this.handleToggle}/>
          <Button inverse onClick={this.handleHome}>Identity Management</Button>
        </AppBar>
        <div className={styles.layout}>
          {children}
          <Errors/>
        </div>
      </section>
    )
  }
}

FramedLayout.propTypes = {
  children: PropTypes.any,
  dispatch: PropTypes.func.isRequired,
}

export default connect()(FramedLayout)
