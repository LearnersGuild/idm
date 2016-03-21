import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import Errors from './Errors'

import styles from './NotSignedIn.scss'

export function notSignedIn({children}) {
  return (
    <div className={styles.layout}>
      {children}
      <Errors/>
    </div>
  )
}

notSignedIn.propTypes = {
  children: PropTypes.any,
}

export default connect()(notSignedIn)
