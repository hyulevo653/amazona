import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from  './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';



//connect db
dotenv.config();
console.log(process.env.MONGODB_URI);
mongoose
.connect(process.env.MONGODB_URI)
.then(()=>{
  console.log('connected to db')
})
.catch((err) => {
  console.log(err.message);
});
// khoi tao app
const app = express();
// format data sang json 
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// router
app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

app.get('/api/keys/google', (req, res) => {
  res.send({ key: process.env.GOOGLE_API_KEY || '' });
});

// upload file to cloudinary
app.use('/api/upload', uploadRouter);
// xoa het san pham cu -> khoi tao lai danh sach san pham
app.use('/api/seed', seedRouter);
// router cho san pham
app.use('/api/products', productRouter);
// router cho user
app.use('/api/users', userRouter);
// router cho order
app.use('/api/orders', orderRouter);

// set public static -> fe 
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/../frontend/build/index.html'))
);


// neu co loi thi di qua day
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port,  ()=> {
    console.log(`serve at http://localhost:${port}`);
});