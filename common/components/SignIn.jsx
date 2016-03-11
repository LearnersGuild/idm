import React, {Component, PropTypes} from 'react'

import {Button} from 'react-toolbox/lib/button'

const styles = {
  button: {
    marginTop: 25,
  },
  div: {
    marginTop: 50,
  },
}

export default class SignIn extends Component {
  render() {
    const redirectTo = (this.props.location && this.props.location.query) ? this.props.location.query.redirect : null
    const signInGoogleHref = redirectTo ? `/auth/google?redirectTo=${redirectTo}` : '/auth/google'
    const signInGitHubHref = redirectTo ? `/auth/github?redirectTo=${redirectTo}` : '/auth/github'
    return (
      <div>
        <Button
          href={signInGoogleHref}
          linkButton
          raised
          accent
          style={styles.button}
          >
          <span className="socicon socicon-google button-icon"></span> Sign-in Using Google
        </Button>
        <br/>
        <Button
          href={signInGitHubHref}
          linkButton
          raised
          accent
          style={styles.button}
          >
          <span className="socicon socicon-github button-icon"></span> Sign-in Using GitHub
        </Button>
      </div>
    )
  }
}

SignIn.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.object.isRequired,
  }),
}
