import React, {PropTypes} from 'react'

import {Button} from 'react-toolbox/lib/button'

import styles from './SignInUp.scss'

export default function signInButton(props) {
  const {
    buttonLabel,
    redirectTo,
  } = props
  const signInGitHubHref = redirectTo ? `/auth/github?redirectTo=${redirectTo}` : '/auth/github'
  return (
    <Button
      href={signInGitHubHref}
      linkButton
      raised
      primary
      style={styles.button}
      >
      <span className="socicon socicon-github button-icon"></span> {`${buttonLabel || 'Sign-in'} Using GitHub`}
    </Button>
  )
}

signInButton.propTypes = {
  buttonLabel: PropTypes.string,
  redirectTo: PropTypes.string,
}
