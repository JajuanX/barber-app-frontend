import axios from 'axios';

export type AuthUser = { _id: string; email: string; name: string; role: 'admin' | 'student' };
export type AuthResponse = { token: string; user: AuthUser };

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '/api';
const client = axios.create({ baseURL: `${API_BASE}/auth` });

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await client.post('/login', { email, password });
  return res.data.data as AuthResponse;
}

export async function register(name: string, email: string, password: string, role: 'admin' | 'student' = 'student') {
  const res = await client.post('/register', { name, email, password, role });
  return res.data.data as AuthResponse;
}
