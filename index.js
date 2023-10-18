require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.SV_PORT
const cors = require('cors');

const db = require('./models');
const { message } = require('./models');

app.use(express.json());

app.use(cors());

app.route('/')
  .get((req, res) => {
    res.json({
      status: 'OK'
    });
  });

app.route('/sendMessage')
  .post((req, res) => {
    const { name, email, messageContent } = req.body;
    message.create({
      name,
      email,
      message: messageContent
    })
    .then(data => res.json({
      status: "success",
      message: "Message sent successfully!",
      data,
    }))
    .catch(err => res.json({
      status: "error",
      message: "Unable to send message for now!",
      err
    }));
  });

app.route('/listMessages')
  .get((req, res) => {
    const { email } = req.query;

    const filter = !email ? {} : { where: { email } };

    try {
      message.findAll(filter).then((data) => res.json(data))
    } catch (err) {
      res.send(err);
    };
  });

db.sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`App listening at ${PORT}`);
  });
  console.log('DB sync is OK!');
});