import samlp from 'samlp'
import url from 'url'
import {decrypt} from 'src/server/symmetricCryptoAES'
import {extendJWTExpiration} from '@learnersguild/idm-jwt-auth/lib/middlewares'

function redirectOnSuccess(req, res, next) {
  const appState = JSON.parse(decrypt(req.query.state))
  // sometimes, we want to tack the JWT onto the end of the redirect URL
  // for cases when cookie-based authentication won't work (e.g., Cordova
  // apps like Rocket.Chat)
  let redirect = decodeURIComponent(appState.redirect || defaultSuccessRedirect)
  if (appState.responseType === 'token') {
    const urlParts = url.parse(redirect)
    urlParts.query = urlParts.query || {}
    urlParts.query.lgJWT = req.lgJWT
    redirect = url.format(urlParts)
  }
  res.redirect(redirect)
}

export function authSuccess(req, res, next) {
  extendJWTExpiration(req, res)
  const {SAMLRequest} = JSON.parse(decrypt(req.query.state))
  if (SAMLRequest) {
    return samlPost(req)(req, res, next)
  }
  return redirectOnSuccess
}

export function samlPost(req) {
  const appState = JSON.parse(decrypt(req.query.state))

  return samlp.auth({
    issuer: process.env.SAML_ISSUER,
    cert: process.env.SAML_PUBLIC_CERT,
    key: process.env.SAML_PRIVATE_KEY,
    audience: 'https://learnersguild.slack.com',
    destination: process.env.SAML_SLACK_POSTBACK_URL,
    profileMapper: mapSAMLUserAttributes,
    signResponse: true,
    signatureNamespacePrefix: 'ds',
    RelayState: appState.RelayState,
    getPostURL(audience, samlRequestDom, req, cb) {
      cb(null, process.env.SAML_SLACK_POSTBACK_URL)
    }
  })
}

export function mapSAMLUserAttributes(user) {
  return {
    getClaims() {
      const nameParts = user.name.split(/\s+/)
      const claims = {
        'User.Email': user.email,
        'User.Username': user.handle,
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
