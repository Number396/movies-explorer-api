const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserById,
  updateUser,
} = require('../controllers/users');

const { auth } = require('../middlewares/auth');

router.get('/me', auth, getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), auth, updateUser);

module.exports = router;
