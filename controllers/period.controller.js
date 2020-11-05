const Period = require("../models/Period.model")
// const Review = require("../models/Review.model")
const createError = require("http-errors")

module.exports.create = (req, res, next) => {
  const period = new Period({
    ...req.body,
    user: req.session.user.id,
  })
  period
    .save()
    .then((period) => {
      res.json(period)
    })
    .catch((e) => next(e))
}


module.exports.getPeriods = (req, res, next) => {
    Period.find({ user: req.session.user.id })
      // .populate("reviews")
      .then((periods) => {
        res.json(periods)
      })
      .catch((e) => next(e))
  }
