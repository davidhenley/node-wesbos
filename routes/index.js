const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const reviewController = require('../controllers/reviewController');
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
  isLoggedIn,
  forgot,
  reset,
  confirmedPasswords,
  update
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

router.post('/forgot', catchErrors(forgot))

// User
router.get('/account', isLoggedIn, account)

router.post('/account', catchErrors(updateAccount));

router.get('/reset/:token', catchErrors(reset));
router.post('/reset/:token',
  confirmedPasswords,
  catchErrors(update)
);

// Map
router.get('/map', storeController.mapPage);

// hearts
router.get('/hearts', isLoggedIn, catchErrors(storeController.getHearts));

// Reviews
router.post('/reviews/:id', isLoggedIn, catchErrors(reviewController.addReview));

// API Endpoints
router.get('/api/search', catchErrors(storeController.searchStores));
router.get('/api/stores/near', catchErrors(storeController.mapStores));
router.post('/api/stores/:id/heart', catchErrors(storeController.heartStore));

module.exports = router;
