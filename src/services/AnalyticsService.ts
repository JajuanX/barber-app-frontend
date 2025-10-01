import axios from 'axios';
import { getAuthToken } from '../context/AuthContext';

const client = axios.create({ baseURL: '/api/analytics' });
client.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  const token = getAuthToken();
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

export type Overview = {
  totalAttempts: number;
  avgScore: number;
  avgPercent: number;
};

export async function fetchOverview(userId?: string): Promise<{ overview: Overview; distribution: { _id: number; count: number }[] }> {
  const res = await client.get('/overview', { params: { userId } });
  return res.data.data as any;
}

export type CategoryRow = { category: string; total: number; correct: number; accuracy: number };
export async function fetchCategories(userId?: string): Promise<CategoryRow[]> {
  const res = await client.get('/categories', { params: { userId } });
  return res.data.data as any;
}

export type StudentStats = {
  last?: { score: number; total: number; percent: number; createdAt: string };
  best?: { score: number; total: number; percent: number; createdAt: string };
};

export async function fetchStudentStats(userId: string): Promise<StudentStats> {
  const res = await client.get('/student-stats', { params: { userId } });
  return res.data.data as StudentStats;
}
