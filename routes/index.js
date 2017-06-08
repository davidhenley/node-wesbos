const express = require('express');
const router = express.Router();
const {
  homePage,
  addStore,
  createStore
} = require('../controllers/storeController');

router.get('/', homePage);
router.get('/add', addStore);
router.post('/add', createStore)

module.exports = router;
