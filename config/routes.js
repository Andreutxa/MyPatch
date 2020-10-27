const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/auth.middleware")
const userController = require("../controllers/user.controller")
const reminderController = require("../controllers/reminder.controller")
const reviewController = require("../controllers/review.controller")
const upload = require('../config/cloudinary.config');

module.exports = router


// ====> LOGIN & AUTHENTICATION
router.post("/login", userController.login) 
router.get("/logout", authMiddleware.isAuthenticated, userController.logout)
router.get('/:id/activate/:token', authMiddleware.isNotAuthenticated, userController.activateUser);

// ====> USER
router.get("/user/:id", authMiddleware.isAuthenticated, userController.profile)
router.get('/users/:id/edit', authMiddleware.isAuthenticated, userController.edit);
router.post('/users/:id/edit', authMiddleware.isAuthenticated, upload.single('avatar'), userController.update);
router.post('/user/new', authMiddleware.isNotAuthenticated, upload.single('avatar'), userController.createUser);

// ====> REMINDERS
router.get("/reminders", authMiddleware.isAuthenticated, reminderController.getReminders)
router.post("/reminder/new", authMiddleware.isAuthenticated, reminderController.create)
router.get('/reminder/:id', authMiddleware.isAuthenticated, reminderController.single)
router.delete("/reminder/:id/delete", authMiddleware.isAuthenticated, reminderController.delete)
router.patch("/reminder/:id/edit", authMiddleware.isAuthenticated, reminderController.edit)
