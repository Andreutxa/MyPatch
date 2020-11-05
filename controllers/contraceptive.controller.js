const Contraceptive = require("../models/Contraceptive.model")
const createError = require("http-errors")

module.exports.create = (req, res, next) => {
  const contraceptive = new Contraceptive({
    ...req.body,
    user: req.session.user.id,
  })
  contraceptive
    .save()
    .then((contraceptive) => {
      res.json(contraceptive)
    })
    .catch((e) => next(e))
}


module.exports.getContraceptive = (req, res, next) => {
    Contraceptive.find({ user: req.session.user.id })
      .then((contraceptive) => {
        res.json(contraceptive)
      })
      .catch((e) => next(e))
  }