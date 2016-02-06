import React from 'react'
import {connect} from 'react-redux'
import {pushPath} from 'redux-simple-router'

import styles from './Root.scss'

export class Root extends React.Component {
  render() {
    return (
      <section className={styles.layout}>
        <div className="display-1">Identity Management</div>
        <div>
          <a className="btn btn-primary" href="/graphql">View GraphiQL</a>
          <a className="btn btn-primary" onClick={() => this.props.dispatch(pushPath('/example'))}>Example</a>
        </div>
        <div>{this.props.children}</div>
      </section>
    )
  }
}

Root.propTypes = {
  dispatch: React.PropTypes.func,
  children: React.PropTypes.any,
}

export default connect()(Root)
