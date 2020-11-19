require("dotenv").config();
require("../config/db.config");
const User = require("../models/User.model");
const Reminder = require("../models/Reminder.model");
const faker = require("faker");

const userIds = [];
const reminderN = 5;

Promise.all([User.deleteMany(), Reminder.deleteMany()])
  .then(() => {
      const user = new User({
        email: 'ana@email.com',
        password: "1234567890",
        name: faker.name.findName(),
        lastName: faker.name.lastName(),
        age: 17,
        period: '24/10/2020',
        durationPeriod: 5,
        contraceptionMth: 'Patch',
        avatar: faker.image.avatar(),
        activation: true
      });
      user
        .save()
        .then((u) => {
          console.log(u.email);
          userIds.push(u.id);
          for (let i = 0; i < reminderN; i++) {
            const reminder = new Reminder({
              title: faker.lorem.sentence(),
              description: faker.lorem.paragraph(),
              type: 'Change patch',
              date: '25/10/2020',
              user: u._id,
            });
            reminder
              .save()
              // .then((r) => {
              //   console.log(r.name);
              //   if (userIds.length >= 2) {
              //     for (let i = 0; i < reviewN; i++) {
              //       const review = new Review({
              //         title: faker.lorem.sentence(),
              //         description: faker.lorem.paragraph(),
              //         score: Math.floor(4 * Math.random() + 1),
              //         product: p._id,
              //         user: userIds.filter((u) => u != p.user)[
              //           Math.floor(Math.random() * (userIds.length - 2))
              //         ],
              //       });
              //       review.save().then((r) => {
              //         console.log(r.title);
              //       });
              //     }
              //   }
              // })
              .catch((e) => console.log(e));
          }
        })
        .catch((e) => console.log(e));
    
  })
  .catch((e) => console.log(e));
