const express = require('express');
const router = express.Router();
const {
  getStores,
  addStore,
  editStore,
  createStore,
  updateStore
} = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(getStores));
router.get('/stores', catchErrors(getStores));
router.get('/stores/:id/edit', catchErrors(editStore));

router.get('/add', addStore);
router.post('/add', catchErrors(createStore));
router.post('/add/:id', catchErrors(updateStore));

module.exports = router;
