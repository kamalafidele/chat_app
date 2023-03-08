const express = require('express');
const { check, validationResult } = require('express-validator');
const UserService = require('../../services/UserService');

const router = express.Router();

router.post(
  '/login',
  [
    check('username', 'username is Required').exists().not().isEmpty(),
    check('password', 'Password is Required').exists().not().isEmpty(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const user = await UserService.getUserByUsername(username.toLowerCase());
    if (!user) return res.status(400).json({ status: 'Please check your Username or Password' });

    const correctPassword = await user.comparePassword(password);

    if (!correctPassword) return res.status(400).json({ status: 'Please check your Username or Password' });

    return res.status(200).json({ jwt_token: user.createToken(), user });
  }
);

module.exports = router;
