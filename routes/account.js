const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../config');

router.post('/signup', (req, res, next) => {
  let user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  user.picture = user.gravatar();
  user.isSeller = req.body.isSeller;

  User.findOne({email: req.body.email}, (err, existingUser) => {
    if (existingUser) {
      res.json({
        success: false,
        message: 'User with such email already exists'
      })
    } else {
      user.save();

      let token = jwt.sign({
        user: user
      }, config.secret, {
        expiresIn: '7d'
      });

      res.json({
        success: true,
        message: 'Enjoy your token',
        token: token
      })
    }
  });
});

router.post('/login', (req, res, next) => {
  
  User.findOne({email: req.body.email}, (err, existingUser) => {
    if (err) throw err;

    if (!existingUser) {
      res.json({
        success: false,
        message: 'Such user does not exist'
      });
    } else if (existingUser) {
      let validPassword = existingUser.comparePassword(req.body.password);

      if (!validPassword) {
        res.json({
          success: false,
          message: 'Wrong password, please, check again'
        });
      } else {
        
        let token = jwt.sign({
          user: existingUser
        }, config.secret, {
          expiresIn: '7d'
        });

        res.json({
          success: true,
          message: 'Enjoy your token',
          token: token
        })
      }
    }
  })
});

module.exports = router;