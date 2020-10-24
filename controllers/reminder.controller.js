const Reminder = require("../models/Reminder.model")
const Review = require("../models/Review.model")
const createError = require("http-errors")

module.exports.list = (req, res, next) => {
  Reminder.find()
    .populate("reviews")
    .populate("user")
    .then((reminders) => {
      res.json(reminders)
    })
    .catch((e) => next(e))
}

module.exports.create = (req, res, next) => {
  const reminder = new Reminder({
    ...req.body,
    user: req.session.user.id,
  })
  reminder
    .save()
    .then((p) => {
      res.json(p)
    })
    .catch((e) => next(e))
}

module.exports.edit = (req, res, next) => {
  Reminder.findById(req.params.id)
    .then((p) => {
      if (p.user != req.currentUser.id) {
        throw createError(403, "You can't edit another user's reminders")
      } else {
        return p.update(req.body).then((editedReminder) => {
          res.json(editedReminder)
        })
      }
    })
    .catch((e) => next(e))
}

module.exports.delete = (req, res, next) => {
  Reminder.findById(req.params.id)
    .then((p) => {
      if (!p) {
        throw createError(404, "Reminder not found")
      } else {
        if (p.user != req.currentUser.id) {
          throw createError(
            403,
            "You cannot delete reminders that aren't yours"
          )
        } else {
          return p.delete().then(() => {
            return Review.remove({reminder: p.id}).then((r) => {
              res.json({})
            })
          })
        }
      }
    })
    .catch((e) => next(e))
}

module.exports.createReview = (req, res, next) => {
  Reminder.findById(req.params.id)
    .then((p) => {
      if (p.user === req.currentUser.id) {
        throw createError(403, "You cannot leave reviews for your own reminder")
      } else {
        const review = new Review({
          ...req.body,
          user: req.currentUser.id,
          reminder: p.id,
        })
        return review.save().then((r) => {
          res.json(r)
        })
      }
    })
    .catch((e) => next(e))
}

module.exports.deleteReview = (req, res, next) => {
  Review.findById(req.params.id)
    .then((r) => {
      if (r.user != req.currentUser.id) {
        throw createError(403, "You cannot delete another user's reviews")
      } else {
        return r.delete().then((r) => {
          res.json({})
        })
      }
    })
    .catch((e) => next(e))
}

module.exports.single = (req, res, next) => {
  Reminder.findById(req.params.id)
    .populate("reviews")
    .populate("user")
    .populate({
      path: 'reviews',
      populate: {
        path: 'user',
        model: 'User'
      }
    })
    .then((prod) => {
      if (!prod) {
        throw createError(404, "Reminder not found")
      } else {
        res.json({prod})
      }
    })
    .catch((e) => next(e))
}
