import passport from "passport";
import passportLocal from "passport-local";
import pool from "./db.js";
import bcrypt from "bcryptjs";

const LocalStrategy = passportLocal.Strategy;

// Used by password.authenticate()
const verify = async (username, password, done) => {
    try {
        const { rows } = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );
        const user = rows[0];

        if (!user) {
            return done(null, false, { message: "Username not found" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
};

passport.use(new LocalStrategy(verify));

// When session is created, takes user object from successful login
// and stores its id in session data
passport.serializeUser((user, done) => {
    done(null, user.uid);
});

// When a matching session for a request is found (i.e. user is logged in),
// uses the id stored in session data to get the user and attach it to req.user.
// So if a user is logged in, the request will have a user field.
passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await pool.query(
            "SELECT * FROM users WHERE uid = $1",
            [id]
        );
        const user = rows[0];

        done(null, user);
    } catch (err) {
        done(err);
    }
});
