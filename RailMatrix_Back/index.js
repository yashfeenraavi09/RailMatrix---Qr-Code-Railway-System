import express from 'express';
import dbConnect from './db.js';
import itemRoutes from './routes/form.routes.js'
import userRoutes from './routes/user.routes.js'
import depotRoutes from './routes/depot.routes.js'
import assetsRoute from './routes/assets.js'
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();
const app = express();

// Connect to MongoDB
dbConnect();


app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/depot', depotRoutes);
app.use('/api/assets', assetsRoute)
// Root endpoint
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
