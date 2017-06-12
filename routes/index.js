const express = require('express');
const router = express.Router();
const {
  getStores,
  addStore,
  editStore,
  createStore,
  updateStore,
  getStoresByTag,
  getStoreBySlug,
  upload,
  resize
} = require('../controllers/storeController');
const {
  loginForm,
  registerForm,
  validateRegister,
  register
} = require('../controllers/userController');
const {
  login
} = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(getStores));
router.get('/stores', catchErrors(getStores));
router.get('/stores/:id/edit', catchErrors(editStore));

router.get('/store/:slug', catchErrors(getStoreBySlug));

router.get('/add', addStore);

router.get('/tags', catchErrors(getStoresByTag));
router.get('/tags/:tag', catchErrors(getStoresByTag));

router.get('/login', loginForm);
router.get('/register', registerForm);

router.post('/register',
  validateRegister,
  catchErrors(register),
  login
);

router.post('/add',
  upload, catchErrors(resize),
  catchErrors(createStore)
);
router.post('/add/:id',
  upload, catchErrors(resize),
  catchErrors(updateStore)
);

module.exports = router;
