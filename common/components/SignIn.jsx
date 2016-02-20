import React, {Component} from 'react'

import RaisedButton from 'material-ui/lib/raised-button'
import FontIcon from 'material-ui/lib/font-icon'

const styles = {
  button: {
    margin: 12,
  },
  div: {
    marginTop: 50,
  }
}

export default class SignIn extends Component {
  render() {
    return (
      <div>
        <RaisedButton
          label="Sign-in Using Google"
          href="/auth/google"
          linkButton
          primary
          style={styles.button}
          icon={<FontIcon className="fa fa-google"/>}
          />
      </div>
    )
  }
}
