const express = require('express');
const {
  body
} = require('express-validator/check');
const isAuth = require('../middleware/is-auth');

const User = require('../models/user');

const authController = require('../controllers/auth');
const router = express.Router();

router.post(
  '/signup',
  [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, {
      req
    }) => {
      return User.findOne({
        email: value
      }).then(userDoc => {
        if (userDoc) {
          alert('Email already exist')
          return Promise.reject('E-Mail address already exists!');
        }
      });
    })
    .normalizeEmail(),
    body('password')
    .trim()
    .isLength({
      min: 5
    }),
    body('name')
    .trim()
    .not()
    .isEmpty()
  ],
  authController.signup
);

router.post('/login', authController.login);
// router.get('/chat', isAuth, authController.getUserStatus);


module.exports = router;