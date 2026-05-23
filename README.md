# StreakFlow

> *"We are what we repeatedly do. Excellence is not an act, but a habit."* — Aristotle

A personal daily habit tracker, streak counter, and reflection journal built from scratch because spreadsheets and phone notes weren't cutting it anymore.

Built by someone who loves cybersecurity, consistency, and building things from zero.

---

## Why I Built This

I was tracking my daily habits in a notebook and scattered phone notes. It worked, but I kept losing streaks without realizing it, forgetting to log things, and had no way to see my progress over time.

I wanted something that felt like *mine*  designed around my actual routines, not a generic productivity app. So I built it.

StreakFlow is that app.

---

## Security Gate

Before you can even reach the login screen, you have to earn access.

StreakFlow opens with a **hacker terminal unlock screen**  a fully animated CLI-style interface that boots up like a real operating system and presents you with a **Caesar cipher challenge**.

Solve the cipher. Decode the password. Gain access.

Every session. Every logout. Every time.

```
  ██████╗████████╗██████╗ ███████╗ █████╗ ██╗  ██╗
 ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██╔══██╗██║ ██╔╝
 ╚█████╗    ██║   ██████╔╝█████╗  ███████║█████╔╝
  ╚═══██╗   ██║   ██╔══██╗██╔══╝  ██╔══██║██╔═██╗
 ██████╔╝   ██║   ██║  ██║███████╗██║  ██║██║  ██╗
 ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝

> Initializing StreakFlow OS...
> Loading habit modules.............. [OK]
> Mounting streak engine............. [OK]
> Connecting to MongoDB.............. [OK]
> Checking user authorization........ [LOCKED]

> CIPHER CHALLENGE:
> 4  21  3  8  5  19  19
> Enter the decoded word to unlock access:
```

---

## Features

### Terminal Security Gate
- Animated hacker-style boot sequence on every visit
- Caesar cipher challenge (A=1, B=2 ... Z=26)
- 3 attempts before reset
- Hint system after failed attempts
- Unlocks per session only — resets on logout, tab close, or browser close
- No persistence - always earn your access

### Habit Tracking
- Daily habit check-ins with one tap
- Automatic streak tracking — current, longest, and total
- Streak milestones at 3, 7, 30, 100, and 365 days
- GitHub-style contribution heatmap per habit
- 30-day consistency percentage per habit
- Streak leaderboard across all habits
- Category filtering  Spiritual, Fitness, Health, Wellness, Growth, Productivity

### Journal & Reflection
- Daily reflection entry  achievements, feelings, struggles
- Mood tracker — happy, neutral, sad
- Link reflections to habits you completed that day
- Weekly mood summary and reflection streak
- Scrollable journal history with expandable entries

### Dashboard & Analytics
- Today's progress ring with live percentage
- 12-week GitHub-style contribution heatmap (combined)
- 30-day consistency bars per habit
- Streak leaderboard with progress bars

### Schedule Planner
- Personal daily schedule
- Work schedule
- Free-time planner
- Time-blocked task list with completion toggle

### General
- Dark mode and light mode toggle
- Mobile responsive with bottom navigation bar
- Skeleton loading states
- Daily reminder notifications
- Secure JWT authentication
- Your data stored in your own MongoDB database
- Footer signed by The Duchess of Hackers

---

## Habit Categories

| Category | Examples |
|---|---|
| Spiritual | Bible reading, Prayer |
| Fitness | Workout, Walk 30 minutes |
| Health | Water intake, Medicine/Vitamins |
| Wellness | Skincare routine, Sleep schedule |
| Growth | Coding/Study, Reading, Journaling |
| Productivity | Daily tasks, Deep work blocks |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS, Vite |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT (JSON Web Tokens) |
| HTTP Client | Axios |
| Toasts | React Hot Toast |
| Routing | React Router DOM |

---

## Project Structure

```
streakflow/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── habitController.js
│   │   └── reflectionController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Habit.js
│   │   └── Reflection.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── habitRoutes.js
│   │   └── reflectionRoutes.js
│   ├── .env
│   └── server.js
│
└── frontend/
    └── src/
        ├── api/
        │   ├── axios.js
        │   └── reflections.js
        ├── components/
        │   ├── DailyReflection.jsx
        │   ├── Footer.jsx
        │   ├── HabitCard.jsx
        │   ├── Navbar.jsx
        │   └── SkeletonCard.jsx
        ├── context/
        │   ├── AuthContext.jsx
        │   └── GameContext.jsx
        ├── hooks/
        │   ├── useHabits.js
        │   ├── useReflections.js
        │   └── useReminders.js
        ├── pages/
        │   ├── GameGate.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx
        │   └── SchedulePage.jsx
        ├── App.jsx
        ├── main.jsx
        └── index.css
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- MongoDB running locally or a MongoDB Atlas account
- Git installed

### 1. Clone the project

```bash
git clone https://github.com/gracequaye1/streakflow.git
cd streakflow
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/streakflow
JWT_SECRET=supersecretkey123
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected
```

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

### 4. Solve the cipher

You will land on the hacker terminal screen.
Decode the cipher to unlock access.
Then register your account and start tracking.

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Get current user |

### Habits
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/habits` | Get all your habits |
| POST | `/api/habits` | Create a new habit |
| PUT | `/api/habits/:id` | Update a habit |
| PATCH | `/api/habits/:id/toggle` | Toggle today's completion |
| DELETE | `/api/habits/:id` | Delete a habit |

### Reflections
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reflections` | Get all reflections |
| POST | `/api/reflections` | Create or update today's reflection |
| GET | `/api/reflections/:date` | Get reflection for specific date |
| PUT | `/api/reflections/:date` | Update a reflection |
| DELETE | `/api/reflections/:date` | Delete a reflection |

---

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port the backend runs on (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `NODE_ENV` | `development` or `production` |

---

## Roadmap

- [x] Hacker terminal security gate
- [x] Caesar cipher unlock challenge
- [x] Habit tracking with streaks
- [x] GitHub-style heatmaps
- [x] Analytics dashboard
- [x] Daily journal and mood tracker
- [x] Schedule planner
- [x] Challenge Mode with check-ins
- [x] XP and badge reward system
- [x] School timetable planner
- [x] Personal study planner
- [x] Dark mode
- [x] Mobile responsive design
- [x] JWT authentication
- [x] Deployed on Vercel and Render
- [ ] Export progress as PDF
- [ ] Mobile app version
- [ ] AI weekly summary
- [ ] Multiplayer streak challenges

---

## Personal Note

This started as a notebook. Then a notes app. Then a spreadsheet.
Now it is a full-stack web app with a hacker terminal gate, built entirely from scratch.

I love cybersecurity. I love consistency. I love building things.
This app is all three.

If you are reading this and you also track your habits manually — you can build your own version too.
Start small. Stay consistent. Ship it.

That is literally what this app is about.

---

```
ACCESS GRANTED. Welcome, Duchess.
StreakFlow unlocked. Redirecting...
```

---

*Made with love, patience, consistency, and a lot of debugging*
*by **The Duchess of Hackers***

