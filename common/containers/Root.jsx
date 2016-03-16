import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Provider} from 'react-redux'

import ToolboxApp from 'react-toolbox/lib/app'

import './Root.scss'

export class Root extends Component {
  render() {
    const {store, children} = this.props
    return (
      <ToolboxApp>
        <Provider store={store}>
          {children}
        </Provider>
      </ToolboxApp>
    )
  }
}

Root.propTypes = {
  auth: PropTypes.shape({
    isSigningIn: PropTypes.bool.isRequired,
    currentUser: PropTypes.object,
  }),
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
