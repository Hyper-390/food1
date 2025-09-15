# Food Delivery Application

A full-stack food delivery application built with React.js frontend and Node.js/Express backend.

## 🚀 Quick Start for VS Code

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- VS Code with recommended extensions

### Setup Instructions

1. **Clone and Open in VS Code**
   ```bash
   git clone <your-repo>
   cd food-delivery-app
   code .
   ```

2. **Install Dependencies**
   ```bash
   npm run install-deps
   ```

3. **Environment Setup**
   - Copy `backend/.env.example` to `backend/.env`
   - Update MongoDB connection string and JWT secret

4. **Start Development**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
food-delivery-app/
├── .vscode/                 # VS Code configuration
│   ├── settings.json        # Editor settings
│   ├── launch.json         # Debug configuration
│   └── extensions.json     # Recommended extensions
├── backend/                # Node.js/Express API
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   └── server.js          # Entry point
├── frontend/              # React.js application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── services/      # API services
│   │   └── App.js         # Main app component
└── package.json           # Root package.json

```

## 🛠 VS Code Features

### Debug Configuration
- Press `F5` to start debugging
- Choose "Launch Full Stack" to run both frontend and backend
- Breakpoints work in both client and server code

### Recommended Extensions
- ESLint for code linting
- Prettier for code formatting
- Auto Rename Tag for JSX
- Path Intellisense for imports

### Keyboard Shortcuts
- `Ctrl+Shift+P` - Command palette
- `Ctrl+`` - Toggle terminal
- `F5` - Start debugging
- `Ctrl+Shift+F` - Search across files

## 📋 Available Scripts

```bash
# Install all dependencies
npm run install-deps

# Start both frontend and backend
npm run dev

# Start only backend
npm run server

# Start only frontend
npm run client
```

## 🔧 Development Workflow

1. **Backend Development**
   - Navigate to `backend/` folder
   - Models are in `models/` folder
   - Controllers in `controllers/` folder
   - Routes in `routes/` folder

2. **Frontend Development**
   - Navigate to `frontend/src/` folder
   - Components in `components/` folder
   - Pages in `pages/` folder
   - Context providers in `context/` folder

3. **API Testing**
   - Backend runs on `http://localhost:5000`
   - Frontend runs on `http://localhost:3000`
   - API endpoints: `http://localhost:5000/api/`

## 🎯 Key Features

- **Authentication**: JWT-based with bcrypt hashing
- **User Roles**: Customer, Restaurant Owner, Delivery, Admin
- **Restaurant Management**: CRUD operations for restaurants and menus
- **Order System**: Complete order lifecycle management
- **Cart Functionality**: Add/remove items, checkout flow
- **Reviews & Ratings**: Rate restaurants and menu items
- **Admin Panel**: Manage users, restaurants, and orders
- **Responsive Design**: Mobile-first approach

## 🔐 Environment Variables

Create `backend/.env` file:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/fooddelivery
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `POST /api/restaurants` - Create restaurant (Auth required)

### Orders
- `GET /api/orders/user` - Get user orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status

### Menu
- `GET /api/menu/restaurant/:id` - Get restaurant menu
- `POST /api/menu` - Add menu item (Auth required)

## 🎨 UI Components

- **Navbar**: Responsive navigation with user menu
- **Footer**: Company info and links
- **LoadingSpinner**: Reusable loading component
- **ProtectedRoute**: Route protection wrapper

## 🚀 Deployment

1. **Backend**: Deploy to Heroku, Railway, or similar
2. **Frontend**: Deploy to Netlify, Vercel, or similar
3. **Database**: Use MongoDB Atlas for production

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.