import React from 'react'

import styles from './Root.scss'

export default class Root extends React.Component {

  render() {
    return (
      <section className={styles.layout}>
        <div className="display-1">Identity Management</div>
        <div>
          <a className="btn btn-primary" href="/docs/#!/default">View API Docs</a>
        </div>
      </section>
    )
  }
}
