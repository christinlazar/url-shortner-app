const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
require('dotenv').config()
passport.use(
  new GoogleStrategy(
    { 
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try { 
        console.log("profile",profile)
        let user = await User.findOne({ googleId: profile.id });
        console.log("user is",user)
        if (!user) {
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePhoto: profile.photos[0].value,
          });
          await user.save();
        }
        console.log("user after saving is",user)
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("user is in googleStrategy",user)
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log("userid is in googleStrategy",_id)
    const user = await User.findById(id);
    console.log("user is in googleStrategy2",user)
    done(null, user);
  } catch (error) {
    console.error(error)
    done(error, null);
  }
});

module.exports = passport;
