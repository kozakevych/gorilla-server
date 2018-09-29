const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Order = require('../models/order');
const config = require('../config');

const checkJWT = require('../middlewares/check-jwt');

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

router.route('/profile')
  .get(checkJWT, (req, res, next) => {

    User.findOne({ _id: req.decoded.user._id }, (err, user) => {
      res.json({
        success: true,
        user: user,
        message: "Successful"
      });
    });

  })
  .post(checkJWT, (req, res, next) => {
    User.findOne({ _id: req.decoded.user._id }, (err, user) => {
      if (err) return next(err);

      if (req.body.name) user.name = req.body.name;
      if (req.body.email) user.email = req.body.email;
      if (req.body.password) user.password = req.body.password;

      user.isSeller = req.body.isSeller;

      user.save();
      res.json({
        success: true,
        message: "Successfully edited your profile"
      });
    });
    
});

router.route('/address')
  .get(checkJWT, (req, res, next) => {

    User.findOne({ _id: req.decoded.user._id }, (err, user) => {
      res.json({
        success: true,
        address: user.address,
        message: "Successful"
      });
    });

  })
  .post(checkJWT, (req, res, next) => {
    User.findOne({ _id: req.decoded.user._id }, (err, user) => {
      if (err) return next(err);

      if (req.body.addr1) user.address.addr1 = req.body.addr1;
      if (req.body.addr2) user.address.addr2 = req.body.addr2;
      if (req.body.city) user.address.city = req.body.city;
      if (req.body.state) user.address.state = req.body.state;
      if (req.body.country) user.address.country = req.body.country;
      if (req.body.postalCode) user.address.postalCode = req.body.postalCode;

      user.save();
      res.json({
        success: true,
        message: "Successfully edited your address"
      });
    });
    
});

router.get('/orders', checkJWT, (req, res, next) => {
  Order.find({ owner: req.decoded.user._id })
    .populate('products.product')
    .populate('owner')
    .exec((err, orders) => {
      if (err) {
        res.json({
          success: false,
          message: 'Could not find any orders'
        })
      } else {
        res.json({
          success: true,
          orders: orders,
          message: 'Here are your orders'
        })
      }
    })
})

router.get('/orders/:id', checkJWT, (req, res, next) => {
  Order.findOne({ _id: req.params._id })
    .deepPopulate('products.product.owner')
    .populate('owner')
    .exec((err, order) => {
      if (err) {
        res.json({
          success: false,
          message: 'Could not find any orders'
        })
      } else {
        res.json({
          success: true,
          order: order,
          message: 'Here are your orders'
        })
      }
    })
})

module.exports = router;