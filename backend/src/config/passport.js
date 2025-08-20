import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Check if user already exists in our DB
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // If user exists, pass them to the next middleware
          return done(null, user);
        } else {
          // If user does not exist, create a new user in our DB
          const newUser = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            // We set a placeholder password since it's required by our schema
            password: "google-user-password", 
          });
          
          await newUser.save();
          return done(null, newUser);
        }
      } catch (err) {
        console.error("Error in Google Strategy:", err);
        return done(err, null);
      }
    }
  )
);

// These are not strictly necessary for our JWT strategy but are good Passport practice.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});