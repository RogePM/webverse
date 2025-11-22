import express from 'express';
import { PORT, mongoDBURL } from './config.js';
import mongoose from 'mongoose';
import foodsRoute from './routes/foodsRoute.js';
import cors from 'cors';

const app = express();

// Parse JSON body
app.use(express.json());

// =========================================================
// 🛡️ CORS CONFIGURATION (Critical for Custom Headers)
// =========================================================
app.use(
  cors({
    // 1. Allow your Next.js frontend origin
    origin: 'http://localhost:3000', 
    
    // 2. Allow standard methods
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    
    // 3. IMPORTANT: Allow the custom header we created!
    allowedHeaders: ['Content-Type', 'x-pantry-id'], 
    
    credentials: true,
  })
);

// =========================================================
// 🚦 ROUTES
// =========================================================

// Simple health check route
app.get('/', (request, response) => {
  console.log(request);
  return response.status(234).send('Welcome to FoodBank Backend!');
});

// Mount the foods route (which contains the multi-tenant middleware)
// This means any request to localhost:5555/foods/... will run your security check.
app.use('/foods', foodsRoute);


// =========================================================
// 💾 DATABASE CONNECTION & SERVER START
// =========================================================
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('✅ App is connected to MongoDB');
    
    const port = process.env.PORT || PORT;
    app.listen(port, () => {
      console.log(`🚀 App is listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log('❌ Database connection error:', error);
  });