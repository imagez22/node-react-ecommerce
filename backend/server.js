import express from 'express';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import config from './config';
import userRoute from './routes/userRoute';
import productRoute from './routes/productRoute';
import orderRoute from './routes/orderRoute';
import uploadRoute from './routes/uploadRoute';

const mongodbUrl = config.MONGODB_URL;
mongoose
  .connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .catch((error) => console.log(error.reason));

const app = express();
app.use(bodyParser.json());
app.use('/api/uploads', uploadRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.get('/api/config/paypal', (req, res) => {
  res.send(config.PAYPAL_CLIENT_ID);
});
app.use('/uploads', express.static(path.join(__dirname, '/../uploads')));

// Serve frontend build if it exists. If not, return a helpful message so
// the server doesn't crash with ENOENT when running in dev without building.
const frontendBuildPath = path.join(__dirname, '/../frontend/build');
const indexHtml = path.join(frontendBuildPath, 'index.html');
if (fs.existsSync(indexHtml)) {
  app.use(express.static(frontendBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(indexHtml);
  });
} else {
  app.get('*', (req, res) => {
    res.status(200).send(
      'Frontend build not found. During development run the frontend dev server (cd frontend && npm start) or create a production build (cd frontend && npm run build) to populate frontend/build.'
    );
  });
}

app.listen(config.PORT, () => {
  console.log('Server started at http://localhost:5000');
});
