import passport from '../lib/passport';
import { NextApiResponse } from 'next';

// eslint-disable-next-line import/no-anonymous-default-export
export default (req:any, res: NextApiResponse) => {
  passport.authenticate('steam', { session: false }, (err:any, user:any) => {
    if (err) {
      return res.redirect('/'); // Redirect to the home page on error
    }
    if (!user) {
      return res.redirect('/'); // Redirect to the home page if user data is not available
    }
    // ROUTE TO /steamlogin WITH USER DATA
    res.redirect(`/steamlogin?name=${JSON.stringify(user._json.personaname)}&id=${user._json.steamid}&url=${JSON.stringify(user._json.profileurl)}`);
  })(req, res);
};
