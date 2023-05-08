
const passport = require('passport');
const passportJWT = require('passport-jwt');

const User = require('../models/user');
const env = require("../config/config");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

console.log("admin middleware file run.....")
passport.use(new JWTStrategy({

  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}, async (jwtPayload, done) => {
  console.log("jwtPayload : ", jwtPayload)
  try {
    const user = await User.findByPk(jwtPayload.userId);
    if (!user) {
      return done(null, false, { message: 'Invalid JWT token' });
    }
    console.log("user : ", user)
    done(null, user.dataValues);
  } catch (error) {
    done(error);
  }
}));

module.exports = function (req, res, next) {
  console.log("PASSPORT ###########")
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    console.log("ERROR : ", err)
    console.log("USER : ", user)
    console.log("INFO : ", info)

    if (err) {
      return next(err);
    }

    if (!user) {
      console.log("!user part");
      return res.status(401).json({ message: 'Unauthorized Access' });
    }
    if (user.is_admin) {
      req.user = user;
      next();
    } else {
      return res.status(403).json({ message: 'Forbidden' });
    }
  })(req, res, next);
};

