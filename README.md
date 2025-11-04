# Perfume Sales Website - Frontend

## Features
- Browse perfumes by category and brand
- Product search and filtering
- User authentication (Login/Register)
- Shopping cart management
- Secure checkout process
- Order tracking
- User profile management

## Technologies
- React 18
- React Router for navigation
- Axios for API calls
- Context API for state management
- CSS3 for styling
- React Icons

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional):
```
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/        # Reusable components
├── context/          # Context providers
├── pages/            # Page components
├── services/         # API services
├── App.js            # Main app component
└── index.js          # Entry point
```

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App
