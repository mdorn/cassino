require('dotenv').config({ path: __dirname + '/../.env' });
const fs = require('fs');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises

// import all of our models - they need to be imported only once
const Resource = require('../models/resource');

const resources = JSON.parse(fs.readFileSync(__dirname + '/resources.json', 'utf-8'));

async function deleteData() {
  console.log('Deleting data...');
  await Resource.remove();
  console.log('Data Deleted. To load sample data, run\n\n\t npm run load-sample-data\n\n');
  process.exit();
}

async function loadData() {
  try {
    await Resource.insertMany(resources);
    console.log('👍 Done!');
    process.exit();
  } catch(e) {
    console.log('\n👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run delete-data\n\n\n');
    console.log(e);
    process.exit();
  }
}
if (process.argv.includes('--delete')) {
  deleteData();
} else {
  loadData();
}
