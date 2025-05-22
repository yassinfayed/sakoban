import axios from 'axios';

// Set base URL for API requests
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:9990/api';

// Retrieve sessionId from localStorage
const sessionId = localStorage.getItem('sessionId');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    // Add Authorization header if sessionId exists
    ...(sessionId && { 'Authorization': `Bearer ${sessionId}` }),
  }
});

// Add a request interceptor to update the header with potentially new sessionId
api.interceptors.request.use(
  config => {
    const currentSessionId = localStorage.getItem('sessionId');
    if (currentSessionId) {
      config.headers.Authorization = `Bearer ${currentSessionId}`;
    } else {
      // Remove Authorization header if no sessionId exists
      delete config.headers.Authorization;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export const getLevels = async () => {
  try {
    const response = await api.get('/levels');
    return response.data;
  } catch (error) {
    console.error('Error fetching levels:', error);
    throw error;
  }
};

export const getLevel = async (levelId: number) => {
  try {
    const response = await api.get(`/levels/${levelId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching level ${levelId}:`, error);
    throw error;
  }
};

export const saveGameProgress = async (
  userId: string, 
  levelId: number, 
  moves: number, 
  isComplete: boolean,
  username: string
) => {
  try {
    const response = await api.post('/games/progress', {
      userId,
      levelId,
      moves,
      isComplete,
      username
    });
    return response.data;
  } catch (error) {
    console.error('Error saving game progress:', error);
    throw error;
  }
};

export const getUserProgress = async (userId: string) => {
  try {
    const response = await api.get(`/games/progress/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching progress for user ${userId}:`, error);
    throw error;
  }
};

// New function to fetch leaderboard data
export const getLeaderboard = async () => {
  try {
    const response = await api.get('/games/leaderboard');
    const data = response.data;
    
    // Sort by moves (ascending) and then by completion time (ascending)
    const sortedData = data.sort((a: any, b: any) => {
      if (a.moves === b.moves) {
        return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime();
      }
      return a.moves - b.moves;
    });
    
    return sortedData;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

export default api;
