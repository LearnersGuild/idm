/* eslint-disable no-undef */
import React from 'react'
import {connect} from 'react-redux'
import {pushPath} from 'redux-simple-router'

import AppBar from 'material-ui/lib/app-bar'
import LeftNav from 'material-ui/lib/left-nav'
import MenuItem from 'material-ui/lib/menus/menu-item'

import styles from './Root.scss'

export class Root extends React.Component {
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

  handleExample() {
    this.handleClose()
    this.props.dispatch(pushPath('/sign-up'))
  }

  handleGraphQL() {
    window.location = '/graphql'
  }

  render() {
    return (
      <section>
        <LeftNav
          docked={false}
          open={this.state.open}
          onRequestChange={open => this.setState({open})}
          >
          <MenuItem onTouchTap={this.handleExample.bind(this)}>Sign-Up</MenuItem>
          <MenuItem onTouchTap={this.handleGraphQL.bind(this)}>View GraphiQL</MenuItem>
        </LeftNav>
        <AppBar
          title="Identity Management"
          titleStyle={{cursor: 'pointer'}}
          onLeftIconButtonTouchTap={this.handleToggle.bind(this)}
          onTitleTouchTap={this.handleHome.bind(this)}
          />
        <div className={styles.layout}>{this.props.children}</div>
      </section>
    )
  }
}

Root.propTypes = {
  dispatch: React.PropTypes.func,
  children: React.PropTypes.any,
}

export default connect()(Root)
