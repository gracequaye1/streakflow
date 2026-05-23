const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "*",
  credentials: false,
}));

app.use(express.json());

app.use('/api/auth',        require('./routes/authRoutes'));
app.use('/api/habits',      require('./routes/habitRoutes'));
app.use('/api/reflections', require('./routes/reflectionRoutes'));
app.use('/api/challenges',  require('./routes/challengeRoutes'));
app.use('/api/timetable',   require('./routes/timetableRoutes'));
app.use('/api/schedule',    require('./routes/scheduleRoutes'));

app.get('/',           (req, res) => res.json({ message: 'StreakFlow API running' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));