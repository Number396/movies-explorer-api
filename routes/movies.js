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

router.post('/', auth, celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(PATTERN),
    trailerLink: Joi.string().required().regex(PATTERN),
    thumbnail: Joi.string().required().regex(PATTERN),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.delete('/:movieId', auth, celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
}), deleteMovieById);

module.exports = router;
