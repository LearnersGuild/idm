import React, {PropTypes} from 'react'
import {Button} from 'react-toolbox/lib/button'

import {buildURL} from 'src/common/util'

export default function AuthButton(props) {
  const {
    label,
    authURL,
    redirect,
    inviteCode,
    RelayState,
    SAMLRequest, 
    responseType,
    onAuthenticate,
  } = props

  const query = (SAMLRequest && RelayState) 
    ? {redirect, inviteCode, responseType, SAMLRequest, RelayState}
    : {redirect, inviteCode, responseType}

  const baseURL = authURL ? authURL : '/auth/github'
  const signInGitHubHref = buildURL(baseURL, query)
  const handleClick = () => {
    onAuthenticate(signInGitHubHref)
  }

  return (
    <Button
      raised
      primary
      onMouseUp={handleClick}
      >
      <span className="socicon socicon-github button-icon"></span> {`${label || 'Sign-in'} Using GitHub`}
    </Button>
  )
}

AuthButton.propTypes = {
  label: PropTypes.string,
  authURL: PropTypes.string,
  redirect: PropTypes.string,
  responseType: PropTypes.string,
  SAMLRequest: PropTypes.string, 
  RelayState: PropTypes.string,
  inviteCode: PropTypes.string,
  onAuthenticate: PropTypes.func.isRequired,
}
