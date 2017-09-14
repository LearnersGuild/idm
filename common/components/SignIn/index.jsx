import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import {Card} from 'react-toolbox/lib/card'
import ProgressBar from 'react-toolbox/lib/progress_bar'

import {buildURL} from 'src/common/util'
import AuthButton from 'src/common/components/AuthButton'
import styles from 'src/common/components/SignInUp/index.scss'

export default class SignIn extends Component {
  render() {
    const {isBusy, onAuthenticate, location: {query}} = this.props
    const signUpLink = buildURL('/sign-up', query)

    const authActions = isBusy ? (
      <ProgressBar className={styles.authActions} type="linear" mode="indeterminate"/>
    ) : (
      <div className={styles.authActions}>
        <AuthButton
          label="Sign-in"
          queryParams={query}
          onAuthenticate={onAuthenticate}
          />
        <div className={styles.signUpLink} >
          <Link to={signUpLink}>Don't have an account? Sign-up.</Link>
        </div>
      </div>
    )

    return (
      <Card className={styles.card}>
        <div className={styles.cardContent}>
          <img className={styles.lgLogo} src="https://brand.learnersguild.org/assets/learners-guild-logo-color-250x149.png"/>
        </div>
        {authActions}
      </Card>
    )
  }
}

SignIn.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.object.isRequired,
  }),
  onAuthenticate: PropTypes.func.isRequired,
  isBusy: PropTypes.bool.isRequired,
}
