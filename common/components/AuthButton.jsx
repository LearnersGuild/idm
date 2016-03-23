import React, {PropTypes} from 'react'

import {Button} from 'react-toolbox/lib/button'

import styles from './SignInUp.scss'

export default function signInButton(props) {
  const {
    buttonLabel,
    redirect,
    authURL,
  } = props
  const baseURL = authURL ? authURL : '/auth/github'
  const signInGitHubHref = redirect ? `${baseURL}?redirect=${redirect}` : baseURL
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
  authURL: PropTypes.string,
  redirect: PropTypes.string,
}
