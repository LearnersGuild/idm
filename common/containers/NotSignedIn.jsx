import React, {PropTypes} from 'react'

import styles from './NotSignedIn.scss'

export default function render({children}) {
  return <div className={styles.layout}>{children}</div>
}

render.propTypes = {
  children: PropTypes.any,
}
