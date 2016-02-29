import React, {Component, PropTypes} from 'react'

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
    const redirectTo = (this.props.location && this.props.location.query) ? this.props.location.query.redirect : null
    const signInHref = redirectTo ? `/auth/google?redirectTo=${redirectTo}` : '/auth/google'
    return (
      <div>
        <RaisedButton
          label="Sign-in Using Google"
          href={signInHref}
          linkButton
          primary
          style={styles.button}
          icon={<FontIcon className="fa fa-google"/>}
          />
      </div>
    )
  }
}

SignIn.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.object.isRequired,
  }),
}
