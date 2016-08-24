import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import Errors from 'src/common/containers/Errors'

import styles from './index.scss'

export function blankLayout({children}) {
  return (
    <div className={styles.layout}>
      {children}
      <Errors/>
    </div>
  )
}

blankLayout.propTypes = {
  children: PropTypes.any,
}

export default connect()(blankLayout)
