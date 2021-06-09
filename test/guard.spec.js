const guard = require('../helper/guard');
const { HttpCode } = require('../helper/constants');
const { User } = '../model/__mocks__/data.js';

const passport = require('passport');

require('../config/passport');

describe('Unit test: helper/guard', () => {
  const req = { get: jest.fn(header => `Bearer ${User.token}`), user: User };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(response => response),
  };
  const next = jest.fn();

  test('run function with user ', () => {
    passport.authenticate('jwt', { session: false }, (err, user, callback) => {
      callback(null, User);
      guard()(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
  test('run function without user ', () => {});
});
