/* eslint-disable @typescript-eslint/no-explicit-any */
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import dotenv from 'dotenv';
import User from '@models/User';

dotenv.config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
};

passport.use(
  new JwtStrategy(
    options,
    async (payload: { id: number }, done: FileCallback) => {
      try {
        const user = await User.findByPk(payload.id);
        if (user) {

          return done(null as any);
        }
        return done(null as any);
      } catch (error) {
        return done(error as any);
      }
    }
  )
);

export default passport;
