import React, {PropTypes} from 'react'

import {Button} from 'react-toolbox/lib/button'

function getButtonURL(baseURL, redirect, inviteCode, responseType) {
  const queryArgs = {redirect, inviteCode, responseType}
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
    responseType,
  } = props
  const baseURL = authURL ? authURL : '/auth/github'
  const signInGitHubHref = getButtonURL(baseURL, redirect, inviteCode, responseType)
  return (
    <Button
      href={signInGitHubHref}
      linkButton
      raised
      primary
      >
      <span className="socicon socicon-github button-icon"></span> {`${label || 'Sign-in'} Using GitHub`}
    </Button>
  )
}

signInButton.propTypes = {
  label: PropTypes.string,
  authURL: PropTypes.string,
  redirect: PropTypes.string,
  responseType: PropTypes.string,
  inviteCode: PropTypes.string,
}
