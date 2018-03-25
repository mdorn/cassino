const mongoose = require('mongoose');
const Resource = mongoose.model('Resource');
// const multer = require('multer');
// const jimp = require('jimp');
// const uuid = require('uuid');

// const multerOptions = {
//   storage: multer.memoryStorage(),
//   fileFilter(req, file, next) {
//     const isPhoto = file.mimetype.startsWith('image/');
//     if(isPhoto) {
//       next(null, true);
//     } else {
//       next({ message: 'That filetype isn\'t allowed!' }, false);
//     }
//   }
// };

// exports.upload = multer(multerOptions).single('photo');

exports.homePage = (req, res) => {
  res.render('index');
};

exports.resource_list = async (req, res) => {
  // const page = req.params.page || 1;
  const limit = 0;
  // const skip = (page * limit) - limit;
  const skip = 0;

  const resourcesPromise = Resource
    .find()
    .skip(skip)
    .limit(limit)
    .sort({ created: 'desc' });

  const countPromise = Resource.count();

  const [resources, count] = await Promise.all([resourcesPromise, countPromise]);
  // const pages = Math.ceil(count / limit);
  // if (!resources.length && skip) {
  //   res.redirect(`/resources/page/${pages}`);
  //   return;
  // }

  res.render('resources', { title: 'Resources', resources, count }); // page, pages, count });
};
