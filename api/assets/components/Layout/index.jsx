'use strict'

import React from 'react'
//import Header from 'components/Header'
//import cx from 'classnames'
import './index.less'


class Layout extends React.Component {

  render () {

    return (
      <div className="main-content">
        {this.props.children}
      </div>
    )
  }
}

Layout.propTypes = {
}
export default Layout
