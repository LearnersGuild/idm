import React, {Component, PropTypes} from 'react'

import {Button} from 'react-toolbox/lib/button'
import {Card} from 'react-toolbox/lib/card'

import styles from './SignInUp.scss'

export default class SignIn extends Component {
  render() {
    const redirectTo = (this.props.location && this.props.location.query) ? this.props.location.query.redirect : null
    const signInGitHubHref = redirectTo ? `/auth/github?redirectTo=${redirectTo}` : '/auth/github'
    return (
      <Card className={styles.card}>
        <div className={styles.cardContent}>
          <img className={styles.lgIcon} src="https://icons.learnersguild.org/apple-touch-icon-60x60.png"/>
          <Button
            href={signInGitHubHref}
            linkButton
            raised
            primary
            style={styles.button}
            >
            <span className="socicon socicon-github button-icon"></span> Sign-in Using GitHub
          </Button>
        </div>
      </Card>
    )
  }
}

SignIn.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.object.isRequired,
  }),
}
