const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');
const { auth } = require('../middlewares/auth');
const { pageNotFound } = require('../errors/badUserResponces');
const { signinValidation, signupValidation } = require('../middlewares/celebValidation');

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.post('/signin', signinValidation, login);
router.post('/signup', signupValidation, createUser);

router.use(auth);
router.use((req, res, next) => {
  next(new NotFoundError(pageNotFound));
});

module.exports = router;
