import React from 'react'

import css from './Root.scss'

export default class Index extends React.Component {

  render() {
    return (
      <section className={css.layout}>
        <div className="display-1">Identity Management</div>
        <div>
          <a className="btn btn-primary" href="/docs/#!/default">View API Docs</a>
        </div>
      </section>
    )
  }
}
