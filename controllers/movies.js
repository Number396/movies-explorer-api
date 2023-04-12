const { default: mongoose } = require('mongoose');
const Movie = require('../models/movie');
const {
  movieValidationError,
  movieFindError,
  movieIdError,
  movieDeleteError,
} = require('../errors/badMovieResponces');

const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailerLink, thumbnail, movieId,
    nameRU, nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(movieValidationError));
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movie) => res.send(movie))
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteMovieById = (req, res, next) => {
  Movie.findOne({ _id: req.params.movieId })
    .orFail(() => {
      throw new NotFoundError(movieFindError);
    })
    .then((movie) => {
      if (req.user._id !== movie.owner.valueOf()) {
        throw new ForbiddenError(movieDeleteError);
      }
      return Movie.deleteOne(movie)
        .then(() => {
          res.status(200).send({ message: 'фильм удалён' });
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(movieIdError));
      } else {
        next(err);
      }
    });
};
