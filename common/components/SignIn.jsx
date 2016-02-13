import React, {Component, PropTypes} from 'react'

import RaisedButton from 'material-ui/lib/raised-button'

export default class SignIn extends Component {
  render() {
    return (
      <div>
        <RaisedButton
          label="Sign In"
          primary
          style={{margin: 12}}
          onTouchTap={this.props.onSignIn}
          />
      </div>
    )
  }
}

SignIn.propTypes = {
  onSignIn: PropTypes.func.isRequired,
}
