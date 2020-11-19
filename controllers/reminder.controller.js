const Reminder = require("../models/Reminder.model")
const createError = require("http-errors")

module.exports.getReminders = (req, res, next) => {
  Reminder.find({ user: req.session.user.id })
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
    .then((reminder) => {
      res.json(reminder)
    })
    .catch((e) => next(e))
}

module.exports.edit = (req, res, next) => {
  console.log('REQ.BODY', req.body);
  Reminder.findOneAndUpdate({ _id: req.params.id }, req.body, { runValidators: true, new: true })
      .then(reminder => {
          res.status(201).json(reminder)
      })
      .catch(next)
}

module.exports.delete = (req, res, next) => {
  Reminder.findByIdAndRemove(req.params.id)
      .then(reminder => res.status(200).json(reminder))
      .catch(err => console.log(err))
}


module.exports.single = (req, res, next) => {
  Reminder.findById(req.params.id)
    .populate("user")
    .then((reminder) => {
      if (!reminder) {
        throw createError(404, "Reminder not found")
      } else {
        res.json({reminder})
      }
    })
    .catch((e) => next(e))
}
