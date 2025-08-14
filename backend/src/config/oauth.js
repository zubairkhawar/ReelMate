const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AppleStrategy = require('passport-apple').Strategy;
const userService = require('../services/userService');

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5001/api/auth/google/callback",
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await userService.findUserByEmail(profile.emails[0].value);
      
      if (user) {
        // Update last login
        await userService.updateLastLogin(user.id);
        return done(null, user);
      }
      
      // Create new user from Google profile
      const newUser = await userService.createUserFromOAuth({
        email: profile.emails[0].value,
        name: profile.displayName,
        oauthProvider: 'google',
        oauthId: profile.id,
        avatarUrl: profile.photos[0]?.value,
        emailVerified: true
      });
      
      return done(null, newUser);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Apple OAuth Strategy (commented out for now - add Apple credentials to enable)
/*
passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH,
    callbackURL: process.env.APPLE_CALLBACK_URL || "http://localhost:5001/api/auth/apple/callback",
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, idToken, profile, done) => {
    try {
      // Apple sends user info only on first login
      const { email, name } = req.body || {};
      
      if (!email) {
        return done(new Error('Email not provided by Apple'), null);
      }
      
      // Check if user already exists
      let user = await userService.findUserByEmail(email);
      
      if (user) {
        // Update last login
        await userService.updateLastLogin(user.id);
        return done(null, user);
      }
      
      // Create new user from Apple profile
      const newUser = await userService.createUserFromOAuth({
        email: email,
        name: name || 'Apple User',
        oauthProvider: 'apple',
        oauthId: profile.id,
        emailVerified: true
      });
      
      return done(null, newUser);
    } catch (error) {
      return done(error, null);
    }
  }
));
*/

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userService.findUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
