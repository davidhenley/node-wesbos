const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const {
  loginForm,
  registerForm,
  validateRegister,
  register,
  account,
  updateAccount
} = require('../controllers/userController');
const {
  login,
  logout,
  isLoggedIn
} = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(storeController.getStores));

// Stores
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/:id/edit', isLoggedIn, catchErrors(storeController.editStore));

router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

router.get('/add', isLoggedIn, storeController.addStore);
router.post('/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);

router.post('/add/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);

// Authentication
router.get('/login', loginForm);
router.post('/login', login);

router.get('/register', registerForm);
router.post('/register',
  validateRegister,
  catchErrors(register),
  login
);

router.get('/logout', logout);

// User
router.get('/account', isLoggedIn, account)

router.post('/account', catchErrors(updateAccount));

module.exports = router;
