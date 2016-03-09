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
    const signInGoogleHref = redirectTo ? `/auth/google?redirectTo=${redirectTo}` : '/auth/google'
    const signInGitHubHref = redirectTo ? `/auth/github?redirectTo=${redirectTo}` : '/auth/github'
    return (
      <div>
        <RaisedButton
          label="Sign-in Using Google"
          href={signInGoogleHref}
          linkButton
          primary
          style={styles.button}
          icon={<FontIcon className="fa fa-google"/>}
          />
        <br/>
        <RaisedButton
          label="Sign-in Using GitHub"
          href={signInGitHubHref}
          linkButton
          primary
          style={styles.button}
          icon={<FontIcon className="fa fa-github"/>}
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
