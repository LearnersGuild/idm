import React, {PropTypes} from 'react'

import {Card} from 'react-toolbox/lib/card'

import SignInButton from './SignInButton'

import styles from './SignInUp.scss'

export default function signIn(props) {
  const {location} = props
  const redirectTo = (location && location.query) ? location.query.redirect : null
  return (
    <Card className={styles.card}>
      <div className={styles.cardContent}>
        <img className={styles.lgIcon} src="https://icons.learnersguild.org/apple-touch-icon-60x60.png"/>
        <SignInButton buttonLabel="Sign-in" redirectTo={redirectTo}/>
      </div>
    </Card>
  )
}

signIn.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.object.isRequired,
  }),
}
