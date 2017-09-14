import React from 'react'
import PropTypes from 'prop-types'
import {Button} from 'react-toolbox/lib/button'

import {buildURL} from 'src/common/util'

export default function AuthButton(props) {
  const {
    label,
    authBaseURL,
    queryParams,
    inviteCode,
    onAuthenticate,
  } = props

  const authQuery = {...queryParams}
  if (inviteCode) {
    authQuery.inviteCode = inviteCode
  }
  const authURL = buildURL(authBaseURL || '/auth/github', authQuery)
  const handleClick = () => {
    onAuthenticate(authURL)
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
  authBaseURL: PropTypes.string,
  inviteCode: PropTypes.string,
  queryParams: PropTypes.object,
  onAuthenticate: PropTypes.func.isRequired,
}
