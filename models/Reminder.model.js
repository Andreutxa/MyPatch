const mongoose = require("mongoose");
const User = require("./User.model");
const Review = require("./Review.model");

const reminderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    type: {
      type: String,
      required: [true, "Price is required"],
      enum: ['', 'Medical appointment', 'Gynecologist appointment']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (document, toReturn) => {
        toReturn.id = document._id;
        delete toReturn.__v;
        delete toReturn._id;
        delete toReturn.createdAt;
        delete toReturn.updatedAt;
        return toReturn;
      },
    },
  }
);



reminderSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "reminder",
});

const Reminder = mongoose.model("Reminder", reminderSchema);

module.exports = Reminder;
