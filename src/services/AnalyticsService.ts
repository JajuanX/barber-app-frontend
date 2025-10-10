import axios from 'axios';
import { getAuthToken } from '../context/AuthContext';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '/api';
const client = axios.create({ baseURL: `${API_BASE}/analytics` });
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

// Self-serve (student)
export async function fetchMyOverview(): Promise<{ overview: Overview; distribution: { _id: number; count: number }[] }> {
  const res = await client.get('/me/overview');
  return res.data.data as any;
}

export async function fetchMyCategories(): Promise<CategoryRow[]> {
  const res = await client.get('/me/categories');
  return res.data.data as any;
}

export async function fetchMySummary(): Promise<StudentStats> {
  const res = await client.get('/me/summary');
  return res.data.data as StudentStats;
}

export type TopStudent = { userId: string; name: string; email: string; avgPercent: number; attempts: number };
export async function fetchTopStudents(): Promise<TopStudent[]> {
  const res = await client.get('/top-students');
  return res.data.data as TopStudent[];
}

export type AttemptRow = { userId?: string; name?: string; score: number; total: number; percent: number; createdAt: string };
export async function fetchLastAttempts(userId?: string): Promise<AttemptRow[]> {
  const res = await client.get('/last-attempts', { params: { userId } });
  return res.data.data as AttemptRow[];
}
