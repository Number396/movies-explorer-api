require('dotenv').config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const errorHandler = require('./middlewares/error-handler');
const routes = require('./routes');
const { PORT, DB_ADDRESS } = require('./config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/rate-limiter');

const app = express();

mongoose.set('strictQuery', true);
app.use(express.json());

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
});

app.use(requestLogger);
app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
