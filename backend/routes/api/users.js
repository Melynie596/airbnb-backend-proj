const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Invalid email')
    .trim()
    .notEmpty()
    .withMessage('Invalid email')
    .isEmail()
    .withMessage('Invalid email'),
    check('username')
    .exists({ checkFalsy: true })
    .withMessage('Username is required')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 4 })
    .withMessage('Username is required'),
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('First Name is required')
    .trim()
    .notEmpty()
    .withMessage('First Name is required')
    .isString()
    .withMessage('First Name is required'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Last Name is required')
    .trim()
    .notEmpty()
    .withMessage('Last Name is required'),
  handleValidationErrors
];
// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;
    const hashedPassword = bcrypt.hashSync(password);

    const existingUsers = await User.findAll();

    for (let users of existingUsers) {
      if (users.email === email){
        return res.status(500).json({
          message: "User already exists",
          errors: {
            email: "User with that email already exists"
          }
        })
      } else if (users.username === username) {
        return res.status(500).json({
          message: "User already exists",
          errors: {
            username: "User with that username already exists"
          }
        })
      }
    }

    const user = await User.create({ email, username, hashedPassword, firstName, lastName });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);

// Get the current User
router.get(
  '/current',
  (req, res) => {
    const { user } = req;
    if (!user) return res.status(401).json({user: null});
    if (user) {
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username
      };
      return res.json({
        user: safeUser
      });
    }
  }
);


module.exports = router;
