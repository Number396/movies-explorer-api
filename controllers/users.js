const { default: mongoose } = require('mongoose');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/users');
const {
  userValidationError,
  userFindError,
  userValidationUpdateError,
  userIdError,
  userEmailConflictError,
  userAuthError,
} = require('../errors/badUserResponces');

const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcryptjs.hash(password, 10)
    .then((hash) => User.create(
      {
        name, email, password: hash,
      },
    ))
    .then((user) => User.findById(user._id.valueOf()))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(userEmailConflictError));
        return;
      }
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(userValidationError));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .orFail(() => {
      throw new UnauthorizedError(userAuthError);
    })
    .then((user) => bcryptjs.compare(password, user.password).then((matched) => {
      if (matched) {
        return user;
      }
      throw new UnauthorizedError(userAuthError);
    }))
    .then((user) => {
      const jwt = jsonwebtoken.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret_code', { expiresIn: '7d' });
      res.send({ token: jwt });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user == null) {
        throw new NotFoundError(userFindError);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(userIdError));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (user == null) {
        throw new NotFoundError(userFindError);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(userValidationUpdateError));
      } else {
        next(err);
      }
    });
};
