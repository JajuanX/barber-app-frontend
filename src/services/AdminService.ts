import axios from 'axios';
import { getAuthToken } from '../context/AuthContext';

const client = axios.create({ baseURL: '/api/admin' });
client.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  const token = getAuthToken();
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

export type UserRow = { _id: string; name: string; email: string; role: 'admin' | 'student' };

export async function listUsers(role?: 'admin' | 'student'): Promise<UserRow[]> {
  const res = await client.get('/users', { params: { role } });
  return res.data.data as any;
}

export async function createUser(input: { name: string; email: string; password: string; role: 'admin' | 'student' }) {
  const res = await client.post('/users', input);
  return res.data.data as UserRow;
}

export async function updateUserRole(id: string, role: 'admin' | 'student') {
  const res = await client.patch(`/users/${id}/role`, { role });
  return res.data.data as UserRow;
}
