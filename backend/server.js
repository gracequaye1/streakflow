const express    = require('express');
const cors       = require('cors');
const dotenv     = require('dotenv');
const connectDB  = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://streakflow-rho.vercel.app",
    "https://streakflow-jpyz.onrender.com",
  ],
  credentials: true,
}));

app.use(express.json());

// Routes
const authRoutes       = require('./routes/authRoutes');
const habitRoutes      = require('./routes/habitRoutes');
const scheduleRoutes   = require('./routes/scheduleRoutes');
const reflectionRoutes = require('./routes/reflectionRoutes');

app.use('/api/auth',        authRoutes);
app.use('/api/habits',      habitRoutes);
app.use('/api/schedule',    scheduleRoutes);
app.use('/api/reflections', reflectionRoutes);

// Health check
app.get('/',          (req, res) => res.json({ message: 'StreakFlow API running' }));
app.get('/api/health',(req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
