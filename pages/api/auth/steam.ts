import passport from '../lib/passport';
import { NextApiResponse } from 'next';

// eslint-disable-next-line import/no-anonymous-default-export
export default (req:any, res: NextApiResponse) => {
  passport.authenticate('steam', {
    session: false,
    failureRedirect: '/', // Redirect to the home page if authentication fails
  })(req, res);
};
