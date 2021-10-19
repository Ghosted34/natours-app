const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

// const DB = process.env.DATABASE.replace(
//   '<password>',
//   process.env.DATABASE_PASSWORD
// );

const DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected sucessfully'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app runnung on ${port}`);
});

// TEST
