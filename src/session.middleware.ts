import * as session from 'express-session';

export const sessionMiddleware = session({
  // cookie: {
  //   httpOnly: true,
  // },
  secret: process.env.SESSION_SECRET ?? 'secret',
  resave: false,
  saveUninitialized: false,
});
