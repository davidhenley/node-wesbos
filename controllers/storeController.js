const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: 'That filetype isn\'t allowed' }, false);
    }
  }
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // If there is no file go on.
  if (!req.file) return next();

  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;

  // Now we resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);

  // Write the photo
  await photo.write(`./public/uploads/${req.body.photo}`);
  next();
};

exports.homePage = (req, res) => {
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug });
  if (!store) return next();
  res.render('store', { store, title: store.name });
};

exports.createStore = async (req, res) => {
  req.body.author = req.user._id;
  const store = await (new Store(req.body)).save();
  req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  const stores = await Store.find();
  res.render('stores', { title: 'Stores', stores });
};

const confirmOwner = (store, user) => {
  if (!store.author.equals(user._id)) {
    throw Error('You must own a store in order to edit it.');
  }
};

exports.editStore = async (req, res) => {
  const store = await Store.findById(req.params.id);

  confirmOwner(store, req.user);

  res.render('editStore', {
    title: `Edit ${store.name}`,
    store
  });
};

exports.getStoresByTag = async (req, res) => {
  const tag = req.params.tag;
  const tagQuery = tag || { $exists: true };

  const [ tags, stores ] = await Promise.all([
    Store.getTagsList(),
    Store.find({ tags: tagQuery })
  ]);

  res.render('tags', { tags, title: 'Tags', tag, stores });
};

exports.updateStore = async (req, res) => {
  req.body.location.type = 'Point';
  const store = await Store.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true, // returns the new store instead of old
      runValidators: true, // runs the required, trim... validators again
    }
  ).exec();
  req.flash('success', `Successfully updated <strong>${store.name}</strong>
  <a href="/stores/${store.slug}">View Store 👉</a>`);
  res.redirect(`/stores/${store._id}/edit`);
};

exports.searchStores = async (req, res) => {
  const stores = await Store
  // first find stores that match
  .find({
    $text: {
      $search: req.query.q
    }
  }, {
    score: { $meta: 'textScore' }
  })
  // then sort them
  .sort({
    score: { $meta: 'textScore' }
  })
  // then limit to only 5 results
  .limit(5);
  res.json(stores);
};

exports.mapStores = async (req, res) => {
  const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
  const q = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates
        },
        $maxDistance: 10000
      }
    }
  };
  const stores = await Store.find(q).select('name photo').limit(10);
  res.json(stores);
};
