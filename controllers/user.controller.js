const createError = require("http-errors")
const User = require("../models/User.model")
const Reminder = require("../models/Reminder.model")
const mongoose = require('mongoose');
const mailer = require('../config/mailer.config');

module.exports.usersHome = (req, res, next) => {
  res.json({})
}

module.exports.createUser = (req, res, next) => {
  const user = new User({
    ...req.body,
    avatar: req.file ? req.file.path : undefined
  });

  user.save()
    .then(user => {
      mailer.sendValidationEmail({
        name: user.name,
        email: user.email,
        id: user._id.toString(),
        activationToken: user.activation.token
      })
      res.status(200).json({
        message: 'Check your email for activation'
      })
    })
    .catch((error) => {

      console.log('entra en el error', error);
      if (error instanceof mongoose.Error.ValidationError) {
        throw createError(400, "Wrong credentials")
      } else if (error.code === 11000) { // error when duplicated user
        throw createError(400, "User already exists")
      } else {
        next(error);
      }
    })
    .catch(e => next(e))
}

module.exports.activateUser = (req, res, next) => {
  User.findOne({ _id: req.params.id, "activation.token": req.params.token })
    .then(user => {
      if (user) {
        user.activation.active = true;

        user.save()
          .then(user => {
            res.status(200).json({
              user,
              message: 'Your account has been activated, log in below!'
            })
          })
          .catch(e => next(e))
      } else {
        throw createError(400, "Invalid link for activating account")
      }
    })
    .catch(e => next(e))
}

module.exports.login = (req, res, next) => {
  const {email, password} = req.body
  if (!email || !password) {
    throw createError(400, "Missing credentials")
  }
  User.findOne({email})
    .then((user) => {
      if (!user) {
        throw createError(400, "Wrong credentials")
      } else {
        return user.checkPassword(password).then((match) => {
          if (!match) {
            throw createError(400, "Wrong credentials")
          } else {
            req.session.user = user
            res.json(user)
          }
        })
      }
    })
    .catch((e) => next(e))
}

module.exports.logout = (req, res, next) => {
  req.session.destroy()
  res.json({message: 'user logout'})
  res.status(204).json()
}

module.exports.profile = (req, res, next) => {
  User.findById(req.params.id)
    // .populate("reviews")
    .populate("reminders")
    // .populate({
    //   path: "reviews",
    //   populate: {
    //     path: "reminder",
    //     model: "Reminder"
    //   },
    // })
    .then((user) => {
			if (user) {
				res.json(user);
			} else {
				throw createError(404, 'User not found');
			}
		})
		.catch(e => next(createError(400, e)));
}

module.exports.edit = (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      res.json(user);
    })
    .catch(next)
}

module.exports.update = (req, res, next) => {
  const body = req.body

  if (req.file) {
    body.avatar = req.file.path
  }

  User.findByIdAndUpdate(req.params.id, body, { runValidators: true, new: true })
    .then(user => {
      if (user) {
        res.json({message: 'User updated successfully'})
      } else {
        throw createError(400, 'User not updated');
      }
    })
    .catch(next)
}


