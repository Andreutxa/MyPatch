const mongoose = require("mongoose");
const User = require("./User.model");

const contraceptiveSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    start_date: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (document, toReturn) => {
        toReturn.id = document._id;
        delete toReturn.__v;
        delete toReturn._id;
        delete toReturn.updatedAt;
        return toReturn;
      },
    },
  }
);


const Contraceptive = mongoose.model("Contraceptive", contraceptiveSchema);

module.exports = Contraceptive;