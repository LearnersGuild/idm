import samlp from 'samlp'

import {downcaseTrimTo21Chars} from 'src/common/util'

export function slackSAMLPost(RelayState) {
  return samlp.auth({
    issuer: process.env.SAML_ISSUER,
    cert: process.env.SAML_PUBLIC_CERT,
    key: process.env.SAML_PRIVATE_KEY,
    audience: 'https://learnersguild.slack.com',
    destination: process.env.SAML_SLACK_POSTBACK_URL,
    profileMapper: _slackProfileMapper,
    signResponse: true,
    signatureNamespacePrefix: 'ds',
    RelayState,
    getPostURL(audience, samlRequestDom, req, cb) {
      cb(null, process.env.SAML_SLACK_POSTBACK_URL)
    }
  })
}

function _slackProfileMapper(user) {
  return {
    getClaims() {
      const nameParts = user.name.split(/\s+/)
      const claims = {
        'User.Email': user.email,
        // Slack usernames are limited to 21 chars
        'User.Username': downcaseTrimTo21Chars(user.handle),
      }
      /* eslint-disable camelcase */
      if (nameParts.length > 0) {
        claims.first_name = nameParts[0]
      }
      if (nameParts.length > 1) {
        claims.last_name = nameParts[nameParts.length - 1]
      }
      /* eslint-enable camelcase */
      return claims
    },

    getNameIdentifier() {
      return {
        nameIdentifier: user.id,
        nameIdentifierFormat: 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent',
      }
    },
  }
}
