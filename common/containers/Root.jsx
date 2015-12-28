import React from 'react'
import { connect } from 'react-redux'
import { pushPath } from 'redux-simple-router'

import styles from './Root.scss'

class Root extends React.Component {
  constructor() {
    super()
    if (typeof(window) !== 'undefined' && window.__INITIAL_STATE__) {
      this.state = window.__INITIAL_STATE__
    }
  }

  render() {
    const welcomeOrSignIn = (this.state && this.state.user) ? (
      <p>Welcome back, {this.state.user.name}!</p>
    ) : (
      <a className="btn btn-primary" href="/auth/google">Sign-in With Google</a>
    )

    return (
      <section className={styles.layout}>
        <div className="display-1">Identity Management</div>
        <div>
          {welcomeOrSignIn}
          <a className="btn btn-primary" href="/docs/#!/default">View API Docs</a>
          <a className="btn btn-primary" onClick={() => this.props.dispatch(pushPath('/example'))}>Example</a>
        </div>
      </section>
    )
  }
}

export default connect()(Root)
