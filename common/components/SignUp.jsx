import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import {Card, CardText} from 'react-toolbox/lib/card'

import updateUser from '../actions/updateUser'

import SignInButton from './SignInButton'
import UserForm from './UserForm'

import styles from './SignInUp.scss'

export default function signUp(props) {
  const {
    auth: {currentUser},
    dispatch,
  } = props

  const handleSubmit = userData => {
    dispatch(updateUser(userData, '/'))
  }

  const cardContent = currentUser ? (
    <div>
      <CardText style={{textAlign: 'left'}}>
        Complete the sign-up process by providing the information below.
      </CardText>
      <UserForm buttonLabel="Sign Up" onSubmit={handleSubmit}/>
    </div>
  ) : (
    <div>
      <h5 className={styles.welcome}>Welcome!</h5>
      <CardText>
        We'll need your <a target="_blank" href="https://github.com">GitHub</a> account information, so the first step is to authenticate using GitHub. If you haven't yet created a GitHub account, you should <a target="_blank" href="https://github.com/join">do that now</a>.
      </CardText>
      <SignInButton buttonLabel="Authenticate" redirectTo="/sign-up"/>
    </div>
  )

  return (
    <Card className={styles.card}>
      <div className={styles.cardContent}>
        <img className={styles.lgIcon} src="https://icons.learnersguild.org/apple-touch-icon-60x60.png"/>
        {cardContent}
      </div>
    </Card>
  )
}

signUp.propTypes = {
  auth: PropTypes.shape({
    isSigningIn: PropTypes.bool.isRequired,
    currentUser: PropTypes.object,
  }),
  dispatch: PropTypes.func,
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  }
}

export default connect(mapStateToProps)(signUp)
