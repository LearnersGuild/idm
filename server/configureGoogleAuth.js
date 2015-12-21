import passport from 'passport'
import { OAuth2Strategy as GoogleOAuth2Strategy } from 'passport-google-oauth'

import { updateUser as updateUserGoogleAuthInfo } from './controllers/GoogleOAuth2'


export default function configureGoogleAuth(/* app */) {
  passport.use(
    new GoogleOAuth2Strategy({
      clientID: process.env.GOOGLE_API_CLIENT_ID,
      clientSecret: process.env.GOOGLE_API_CLIENT_SECRET,
      callbackURL: `${process.env.APP_BASEURL}/auth/google/callback`,
    }, updateUserGoogleAuthInfo)
  )
}
