/* global __CLIENT__ */
import './graphiQLHacks' // this is terrible, but GraphiQL doesn't support SSR
import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'

import GraphiQLComponent from 'graphiql'
import fetch from 'isomorphic-fetch'

import 'graphiql/graphiql.css'

function getGraphQLFetcher(auth) {
  return graphQLParams => {
    return fetch('/graphql', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.currentUser.lgJWT}`,
      },
      body: JSON.stringify(graphQLParams),
    }).then(response => response.json())
  }
}

class GraphiQL extends Component {
  constructor(props) {
    super(props)
    this.resizeGraphiQL = this.resizeGraphiQL.bind(this)
  }

  resizeGraphiQL(component) {
    // hack warning -- GraphiQL expands to fill the parent div, so we need to
    // ensure that our height is 100% up the chain
    if (__CLIENT__) {
      let node = ReactDOM.findDOMNode(component)
      while (node) {
        node = node.parentNode
        if (node.tagName === 'BODY') {
          break
        }
        node.style.height = '100%'
      }
    }
  }

  render() {
    const {auth} = this.props
    return (
      <GraphiQLComponent ref={this.resizeGraphiQL} fetcher={getGraphQLFetcher(auth)}/>
    )
  }
}

GraphiQL.propTypes = {
  auth: PropTypes.shape({
    isBusy: PropTypes.bool.isRequired,
    currentUser: PropTypes.object,
  }),
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  }
}

export default connect(mapStateToProps)(GraphiQL)
