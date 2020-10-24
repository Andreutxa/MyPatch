const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/auth.middleware")
const baseController = require("../controllers/base.controller")
const userController = require("../controllers/user.controller")
const reminderController = require("../controllers/reminder.controller")
const reviewController = require("../controllers/review.controller")

module.exports = router

router.get("/", baseController.index)

// Authentication
router.post("/login", userController.login)
router.get("/logout", authMiddleware.isAuthenticated, userController.logout)

// Users
router.get("/user/:id", authMiddleware.isAuthenticated, userController.profile)

// Products
router.get("/product", authMiddleware.isAuthenticated, reminderController.list)

router.post(
  "/product",
  authMiddleware.isAuthenticated,
  reminderController.create
)

router.get('/product/:id', authMiddleware.isAuthenticated, reminderController.single)

router.patch(
  "/product/:id/edit",
  authMiddleware.isAuthenticated,
  reminderController.edit
)

router.delete(
  "/product/:id",
  authMiddleware.isAuthenticated,
  reminderController.delete
)

// Reviews
router.post("/product/:id/review", authMiddleware.isAuthenticated, reviewController.createReview)
router.delete("/review/:id", authMiddleware.isAuthenticated, reviewController.deleteReview)