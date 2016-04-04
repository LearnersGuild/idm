import React, {PropTypes} from 'react'
import {Link} from 'react-router'

import {Card} from 'react-toolbox/lib/card'

import AuthButton from './AuthButton'

import styles from './SignInUp.scss'

export default function signIn(props) {
  const {location} = props
  const redirect = (location && location.query) ? location.query.redirect : null
  const responseType = (location && location.query) ? location.query.responseType : null
  return (
    <Card className={styles.card}>
      <div className={styles.cardContent}>
        <img className={styles.lgLogo} src="https://brand.learnersguild.org/assets/learners-guild-logo-black-250x149.png"/>
        <AuthButton label="Sign-in" redirect={redirect} responseType={responseType}/>
        <div className={styles.signUpLink} >
          <Link to="/sign-up">Don't have an account? Sign-up.</Link>
        </div>
      </div>
    </Card>
  )
}

signIn.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.object.isRequired,
  }),
}
