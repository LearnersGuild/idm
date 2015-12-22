import React from 'react'

import styles from './Root.scss'

export default class Root extends React.Component {
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
        </div>
      </section>
    )
  }
}
