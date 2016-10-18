import React, {Component, PropTypes} from 'react'
import {connect, Provider} from 'react-redux'

import 'react-toolbox/lib/commons.scss' // reset

import './index.css'

export class Root extends Component {
  render() {
    const {store, children} = this.props
    return (
      <Provider store={store}>
        {children}
      </Provider>
    )
  }
}

Root.propTypes = {
  auth: PropTypes.shape({
    isBusy: PropTypes.bool.isRequired,
    currentUser: PropTypes.object,
  }).isRequired,
  store: PropTypes.object.isRequired,
  children: PropTypes.any,
  dispatch: PropTypes.func,
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  }
}

export default connect(mapStateToProps)(Root)
