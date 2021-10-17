const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./natourRoutes/tourRoutes');
const userRouter = require('./natourRoutes/userRoutes');

const app = express();

// Top Level Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware!!!');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toUTCString();
  next();
});

// Route/Request
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Export for server

module.exports = app;
