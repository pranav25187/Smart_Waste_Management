export const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-backend-app.vercel.app/api'
  : 'http://localhost:5000/api';
