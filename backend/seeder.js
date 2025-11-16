import mongoose from 'mongoose';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import dotenv from 'dotenv';

dotenv.config();

// Support either MONGO_URI or MONGODB_URL environment variable and
// fall back to a sensible local default to avoid `undefined` errors.
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URL || 'mongodb://127.0.0.1/amazona';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log(`MongoDB Connected for Seeding: ${MONGO_URI}`))
  .catch((err) => console.error('MongoDB connection error (seeder):', err));

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    await User.insertMany(users);
    await Product.insertMany(products);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
