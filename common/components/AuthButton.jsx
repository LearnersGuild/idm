import React, {PropTypes} from 'react'

import {Button} from 'react-toolbox/lib/button'

import styles from './SignInUp.scss'

function getButtonURL(baseURL, redirect, inviteCode) {
  const queryArgs = {redirect, inviteCode}
  const queryStr = Object.keys(queryArgs).reduce((args, key) => {
    const val = queryArgs[key]
    if (val) {
      args.push(`${key}=${encodeURIComponent(val)}`)
    }
    return args
  }, []).join('&')
  return `${baseURL}?${queryStr}`
}

export default function signInButton(props) {
  const {
    label,
    authURL,
    redirect,
    inviteCode,
  } = props
  const baseURL = authURL ? authURL : '/auth/github'
  const signInGitHubHref = getButtonURL(baseURL, redirect, inviteCode)
  return (
    <Button
      href={signInGitHubHref}
      linkButton
      raised
      primary
      style={styles.button}
      >
      <span className="socicon socicon-github button-icon"></span> {`${label || 'Sign-in'} Using GitHub`}
    </Button>
  )
}

signInButton.propTypes = {
  label: PropTypes.string,
  authURL: PropTypes.string,
  redirect: PropTypes.string,
  inviteCode: PropTypes.string,
}
