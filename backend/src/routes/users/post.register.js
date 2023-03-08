const express = require('express');
const { check, validationResult } = require('express-validator');
const UserService = require('../../services/UserService');

const router = express.Router();

router.post(
  '/register',
  [
    check('firstName', 'FirstName is required').exists().not().isEmpty(),
    check('lastName', 'LastName is required').exists().not().isEmpty(),
    check('username', 'Username is required').exists().not().isEmpty(),
    check('password', 'Password is required').exists().isLength({ min: 6 }).not().isEmpty(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { firstName, lastName, username, password } = req.body;

    try {
      const checkUsername = await UserService.getUserByEmail(username.toLowerCase());
      if (checkUsername) return res.status(400).json({ status: 'Username Already Exist' });

      
      await UserService.create({
        firstName,
        lastName,
        username: username.toLowerCase(),
        password,
      });

      return res.status(200).json({ status: 'registered succefully' });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e });
    }
  }
);

module.exports = router;
