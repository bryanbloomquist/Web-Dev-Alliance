var db = require("../models");
const bcrypt = require('bcrypt');
var { check, validationResult } = require('express-validator/check');

module.exports = function (app) {
  //this post is to handle new user creation requests
  app.post("/api/user", [
    check("username", 'Name is required')
      .not().isEmpty()
      .custom(value => {
        return db.User.findOne({ where: { username: value } }).then(user => {
          if (user) {
            return Promise.reject('User already in use');
          }
        })
      }),
    check("password", 'Password is required').not().isEmpty(),
    check("passwordVerify", 'Invalid Password\n Must be at least 4 characters long')
      .isLength({ min: 4 })
      .custom((value, { req, loc, path }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        } else {
          return value;
        }
      })
  ], function (req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log("ERRORS EXIST");
      return res.status(422).json({ errors: errors.array() });

    } else {
      bcrypt.hash(req.body.password, 10, function (err, hash) {
        db.User.create({
          username: req.body.username,
          password: hash
        })
          .then(function (dbUser) {
            console.log(req.body.username + " was submitted for creation\n Hashed PW: " + hash);
            res.json({ id: dbUser.insertID });

          });
      });

    }
  });
}
