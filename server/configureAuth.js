import {
  getPassport,
  authMiddleware,
  getCallbackMiddleware,
  setCookieMiddleware,
  getJWTCheckMiddleware,
  getUserFromJWTMiddleware,
} from '@learnersguild/passport-auth0-jwt-cookie'

const domain = 'learnersguild.auth0.com'
const defaultSuccessRedirect = '/'
const failureRedirect = '/'

export default function configureAuth(app) {
  // ensure API routes require JWT
  app.use([
    '/graphql'
  ], getJWTCheckMiddleware(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_CLIENT_SECRET))

  // add a user to the request if a JWT is passed
  app.use(getUserFromJWTMiddleware(domain))

  // set up passport via Auth0
  const passport = getPassport(
    domain,
    process.env.AUTH0_CLIENT_ID,
    process.env.AUTH0_CLIENT_SECRET,
    '/auth/callback'
  )
  app.use(passport.initialize())

  // set up authentication routes
  app.use('/auth/google', authMiddleware)
  app.use('/auth/callback', getCallbackMiddleware(failureRedirect), setCookieMiddleware)
  app.get('/auth/callback', (req, res) => {
    const redirectTo = req.appState ?
      (req.appState.redirectTo || defaultSuccessRedirect) :
      defaultSuccessRedirect
    res.redirect(redirectTo)
  })
}
