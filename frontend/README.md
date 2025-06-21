<!-- ------------------- -->
<!-- Final Project Notes -->
<!-- ------------------- -->

There are three (3) main pages that I've been working on for this project - the landing page, event creation page, and preview page.

Landing Page
- The UI was the focus for this page as I wanted the design to be simple and welcoming. This is why you only see the top header and the welcome message. You are able to scroll down and see more of the "story" of Fether, but I like how if you already know the website there's no fluff upon entry.
- Main strengths are UI/UX

Event Creation Page
- Easily where most of the work I've spent on this project. It was necessary to start on paper to get the idea of "flow" for this page. I asked for feedback from family, and went over a lot of different variations of what to make the page look like. Conveying simplicity, while also making it capable of complex planning, was difficult.
- Main strengths are the UI/UX, the Event Progress tracker, and interactive buttons.

Preview Page
- This is what the participant will see when they get the link. I had to add a way to vote on options and display the voted option costs. The view selection summary is essentially the itinerary of the event assuming the voted options are finalized.

Other Notes:
Refactored the App.js and CreateYourEvent.jsx and expanded components to help with more universale elements.

Created and connected the backend to MongoDB, though it just runs locally for now.

Adjustments Have been made to make the app more mobile friendly as well as remove the alerts that were showing up before.

BELOW IS THE OFFICIAL README.md

<!-- ------------------- -->
<!-- Final Project Notes -->
<!-- ------------------- -->

# Fether - Event Planning Made Simple

Fether is a comprehensive event planning application that streamlines the process of organizing group activities, from intimate dinner dates to multi-day vacations. The platform eliminates the chaos of endless text threads and email chains by providing a centralized hub for event coordination, participant voting, and itinerary management.

The application features an intuitive event creation flow where organizers can set up basic event details, add multiple activity options, configure support services like transportation and accommodation, and allow participants to vote on their preferences. Fether automatically calculates cost estimates and helps finalize the perfect itinerary based on group input. Whether you're planning a simple gathering or a complex multi-day adventure, Fether transforms event planning from a burden into an enjoyable collaborative experience.

Built with modern web technologies including React, Material-UI, Node.js, and MongoDB, Fether offers a responsive design that works seamlessly across all devices. The platform emphasizes user experience with thoughtful animations, clear progress tracking, and an elegant interface that makes group planning feel effortless and engaging.

## 🚀 Features

- **Intuitive Event Creation**: Multi-step event setup with progress tracking and form validation
- **Activity Management**: Add votable or fixed activities with cost estimates and time commitments
- **Support Services**: Configure transportation, accommodation, and meal options with voting
- **Participant Voting**: Allow attendees to vote on activities, dates, and support options
- **Cost Calculation**: Automatic cost estimation and budget tracking across all activities
- **Event Management**: View, edit, delete, and manage all your events in one dashboard
- **Advanced Search & Filtering**: Find events by name, status, date, or tags
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop with adaptive layouts
- **Dark/Light Mode**: Toggle between themes with system preference detection and persistence
- **Real-time Preview**: See exactly how participants will view your event before publishing
- **Loading States**: Smooth loading indicators and skeleton screens for better UX
- **Error Handling**: User-friendly error messages with retry functionality and graceful degradation
- **Form Validation**: Real-time validation with helpful error messages and input guidance
- **Data Persistence**: Automatic saving and unsaved changes warnings
- **Modern Animations**: Smooth transitions and micro-interactions using Framer Motion

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern JavaScript framework
- **Material-UI (MUI) 6** - Component library for consistent design
- **Framer Motion 12** - Smooth animations and transitions
- **Axios 1.8** - HTTP client for API communication

### Backend
- **Node.js** - Server runtime
- **Express 4** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose 8** - MongoDB object modeling

### New Packages Added
- **@tanstack/react-query** - Advanced data fetching, caching, and synchronization
- **react-hook-form** - Efficient form handling with validation and better UX
- **date-fns** - Modern date utility library for date formatting and manipulation
- **@mui/x-date-pickers** - Material-UI date/time picker components

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 16 or higher)
- **npm** (version 8 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** for cloning the repository

## 🏗️ Local Development Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd fether
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
touch .env

# Add the following to your .env file:
# MONGO_URI=mongodb://localhost:27017/fether
# PORT=5000

# Start the backend server in development mode
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies (includes new packages)
npm install

# Install the new packages if not already included
npm install @tanstack/react-query @tanstack/react-query-devtools react-hook-form date-fns @mui/x-date-pickers

# Start the development server
npm start
```

The frontend application will run on `http://localhost:3000`

### 4. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB Community Edition from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb/brew/mongodb-community
   
   # On Windows (run as administrator)
   net start MongoDB
   
   # On Ubuntu
   sudo systemctl start mongod
   ```
3. Use connection string: `mongodb://localhost:27017/fether`

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier available)
3. Create a database user and get your connection string
4. Update the `MONGO_URI` in your `.env` file with your Atlas connection string

## 🎮 Usage

1. **Landing Page**: Visit `http://localhost:3000` to see the modern landing page
2. **Create an Event**: Click "Create an Event" to start the event creation flow
3. **Dark/Light Mode**: Toggle themes using the theme button in the header
4. **View Events**: Access "My Events" to see all created events with search and filtering
5. **Event Management**: Edit, delete, or view detailed event information
6. **Responsive Design**: Test on different screen sizes - fully responsive!

## 🎨 Design Features

- **Mobile-First Design**: Optimized for smartphones and tablets
- **Progressive Enhancement**: Enhanced experience on larger screens
- **Accessibility**: WCAG compliant with proper contrast and navigation
- **Smooth Animations**: Framer Motion powered transitions
- **Theme Support**: Dark and light modes with system preference detection

## 📁 Project Structure

```
fether/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── services/       # API service functions
│   │   └── App.js          # Main application component
│   ├── public/             # Static assets
│   └── package.json
├── backend/
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API route handlers
│   ├── server.js           # Express server setup
│   └── package.json
└── README.md
```

## 🔧 Available Scripts

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite

### Backend
- `npm run dev` - Start with nodemon (auto-restart)
- `npm start` - Start production server

## 🌐 API Endpoints

- `GET /api/events` - Fetch all events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get specific event
- `PUT /api/events/:id/suggestions` - Add date/time suggestions
- `PUT /api/events/:id/activities/:actId/vote` - Vote on activity

## 🚀 Deployment

The application is configured for deployment on modern platforms:

- **Frontend**: Vercel, Netlify, or GitHub Pages
- **Backend**: Heroku, Railway, or DigitalOcean
- **Database**: MongoDB Atlas for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support or questions, please contact [your-email@example.com] or open an issue on GitHub.

---

Built with ❤️ by [Your Name] as part of SD-6300 Final Project