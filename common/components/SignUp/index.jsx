import React, {Component, PropTypes} from 'react'
import {Button} from 'react-toolbox/lib/button'
import {Card, CardText} from 'react-toolbox/lib/card'
import Input from 'react-toolbox/lib/input'
import ProgressBar from 'react-toolbox/lib/progress_bar'

import {buildURL} from 'src/common/util'
import AuthButton from 'src/common/components/AuthButton'
import UserForm from 'src/common/containers/UserForm'
import styles from 'src/common/components/SignInUp/index.scss'

class SignUp extends Component {
  constructor(props) {
    super(props)
    this.handleSubmitCode = this.handleSubmitCode.bind(this)
  }

  handleSubmitCode(e) {
    e.preventDefault()
    const nameInput = e.target.elements[0]
    this.props.onSubmitCode(nameInput.value)
  }

  renderCodeForm() {
    return (
      <div>
        <CardText>Sign-up is by invitation only right now.</CardText>
        <form style={{textAlign: 'center'}} method="post" onSubmit={this.handleSubmitCode}>
          <Input
            type="text"
            label="Invite Code"
            name="code"
            />
          <Button
            label="Continue"
            primary
            raised
            type="submit"
            />
        </form>
      </div>
    )
  }

  renderValidating() {
    return (
      <div>
        <CardText>Validating invite code ...</CardText>
        <ProgressBar type="linear" mode="indeterminate"/>
      </div>
    )
  }

  renderUserForm() {
    const {location: {query: {redirect, responseType}}} = this.props
    return (
      <div className="SignUp--UserForm">
        <CardText style={{textAlign: 'left'}}>
          Complete the sign-up process by providing the information below.
        </CardText>
        <UserForm buttonLabel="Sign Up" redirect={redirect} responseType={responseType}/>
      </div>
    )
  }

  renderAuth(code) {
    const {
      location: {query: {redirect, responseType}},
      auth: {isBusy},
      onAuthenticate,
    } = this.props
    const redirectPath = buildURL(`/sign-up/${code}`, {redirect, responseType})
    const authActions = isBusy ? (
      <ProgressBar className={styles.authActions} type="linear" mode="indeterminate"/>
    ) : (
      <AuthButton
        className={styles.authActions}
        label="Authenticate"
        authURL={'/auth/github/sign-up'}
        redirect={redirectPath}
        inviteCode={code}
        onAuthenticate={onAuthenticate}
        />
    )

    return (
      <div>
        <h5 className={styles.welcome}>Welcome!</h5>
        <CardText>
          We'll need your <a target="_blank" href="https://github.com">GitHub</a> account information, so the first step is to authenticate using GitHub. If you haven't yet created a GitHub account, you should <a target="_blank" href="https://github.com/join">do that now</a>.
        </CardText>
        {authActions}
      </div>
    )
  }

  render() {
    const {
      auth: {currentUser},
      code,
      inviteCodes,
    } = this.props

    // sign-up rendering:
    // 1. if an invite code is supplied, then
    //   a. validate invite code, then if valid
    //     i. ask the user to authenticate
    //     ii. once authenticated, ask the user to complete their user profile
    //   b. if invite code is invalid, display an error
    // 2. if no invite code is supplied, ask the user to provide one
    let cardContent = null
    if (code) {
      if (inviteCodes.isBusy) {
        // invite codes are still loading, so we can't yet validate the code
        cardContent = this.renderValidating()
      } else if (inviteCodes.codes[code]) {
        if (currentUser) {
          // user has already authenticated, render the user form
          cardContent = this.renderUserForm()
        } else {
          // user has not yet authenticated, ask them to authenticate
          cardContent = this.renderAuth(code)
        }
      } else {
        // invalid invite code
        cardContent = (
          <CardText>Invalid invite code.</CardText>
        )
      }
    } else {
      // no invite code supplied, ask for one
      cardContent = this.renderCodeForm()
    }

    return (
      <Card className={styles.card}>
        <div className={styles.cardContent}>
          <img className={styles.lgLogo} src="https://brand.learnersguild.org/assets/learners-guild-logo-black-250x149.png"/>
          {cardContent}
        </div>
      </Card>
    )
  }
}

SignUp.propTypes = {
  auth: PropTypes.shape({
    isBusy: PropTypes.bool.isRequired,
    currentUser: PropTypes.object,
  }),
  inviteCodes: PropTypes.shape({
    isBusy: PropTypes.bool.isRequired,
    codes: PropTypes.object.isRequired,
  }).isRequired,
  onAuthenticate: PropTypes.func.isRequired,
  onSubmitCode: PropTypes.func.isRequired,
  code: PropTypes.string,
  location: PropTypes.shape({
    query: PropTypes.object.isRequired,
  }),
}

export default SignUp
