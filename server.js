console.log("oky lets go a head");

// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { connectDB } from './Src/config/db.js';
import SubjectRoutes from './Src/routes/SubjectRoutes.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', SubjectRoutes);

app.get('/', (req, res) => {
  res.send("API is Working Fine..!");
});

// Admin Login Route
app.post("/admin", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.json({ token });
    } else {
      return res.status(401).json({ message: "❌ Invalid credentials" });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

// Connect DB and Start Server
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Access it here: http://localhost:${PORT}`);
});
