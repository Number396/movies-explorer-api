const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { PATTERN } = require('../config');
const {
  createMovie,
  getMovies,
  deleteMovieById,
} = require('../controllers/movies');
const { auth } = require('../middlewares/auth');

router.get('/', auth, getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(PATTERN),
    trailerLink: Joi.string().required().regex(PATTERN),
    thumbnail: Joi.string().required().regex(PATTERN),
    movieId: Joi.string().required().hex().length(24),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), auth, createMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
}), auth, deleteMovieById);

module.exports = router;
