const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const SALT_WORK_FACTOR = 10;
const Reminder = require("./Reminder.model");
const Period = require("./Period.model");
const generateRandomToken = () => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [EMAIL_PATTERN, "Email is not valid"],
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [10, "Password must have 10 characters or more"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Lastnames is required"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
    },
    period: {
      type: String,
      // type: Date,
      required: [true, "Period is required"],
    },
    durationPeriod: {
      type: Number,
      required: [true, "Duration period is required"],
    },
    avatar: {
      type: String
    },
    activation: {
      active: {
        type: Boolean,
        default: false
      },
      token: {
        type: String,
        default: generateRandomToken
      }
    },
    contraceptionMth: {
      type: String,
      enum: ['Pill', 'Patch', 'Ring', 'Injection', 'IUD', 'IUS'],
      //injection(1 - 3 meses), Pill(todos los días), Patch(semanalmente), Ring(mensual), IUD(5- 10 años), IUS(1-5 años)
      required: [true, "Contraception method is required"],
    }
    // reminders: {
    //   type: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Reminder'
    //   }],
    //   default: []
    // },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (document, toReturn) => {
        toReturn.id = document._id;
        delete toReturn.password;
        delete toReturn.__v;
        delete toReturn._id;
        delete toReturn.createdAt;
        delete toReturn.updatedAt;
        return toReturn;
      },
    },
  }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (user.isModified("password")) {
    // Hash password
    bcrypt
      .genSalt(SALT_WORK_FACTOR)
      .then((salt) => {
        return bcrypt.hash(user.password, salt).then((hash) => {
          user.password = hash;
          next();
        });
      })
      .catch((e) => next(e));
  } else {
    next();
  }
});

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.virtual("reviews", {
  ref: 'Review',
  localField: '_id',
  foreignField: 'user'
});

userSchema.virtual("reminders", {
  ref: 'Reminder',
  localField: '_id',
  foreignField: 'user'
});

userSchema.virtual("allPeriods", {
  ref: 'Period',
  localField: '_id',
  foreignField: 'user'
});

const User = mongoose.model("User", userSchema);

module.exports = User;
