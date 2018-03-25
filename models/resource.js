const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a resource name'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{
      type: Number,
      required: 'You must supply coordinates'
    }],
    address: {
      type: String,
      required: 'You must supply an address'
    }
  },
  photo: String,
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author'
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// MongoDB indexes
resourceSchema.index({
  name: 'text',
  description: 'text'
});
resourceSchema.index({ location: '2dsphere' });

resourceSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(this.name);
  // find other items that have a slug of foo, foo-1, foo-2
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const itemsWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (itemsWithSlug.length) {
    this.slug = `${this.slug}-${itemsWithSlug.length + 1}`;
  }
  next();
});

resourceSchema.statics.getTagsList = function() {
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
};

module.exports = mongoose.model('Resource', resourceSchema);
