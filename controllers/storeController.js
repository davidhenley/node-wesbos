const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save();
  req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  const stores = await Store.find();
  res.render('stores', { title: 'Stores', stores });
};

exports.editStore = async (req, res) => {
  const store = await Store.findById(req.params.id);

  // TODO Confirm they are the owner of the store

  res.render('editStore', {
    title: `Edit ${store.name}`,
    store
  });
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
}
