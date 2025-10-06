import axios, { AxiosInstance } from 'axios';
const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '/api';
import { getAuthToken } from '../context/AuthContext';

export type QuestionPayload = {
  category: string;
  text: string;
  options: { key: string; text: string }[];
  correctKey: string;
  explanation?: string;
};

class QuestionService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({ baseURL: `${API_BASE}/questions` });
    this.client.interceptors.request.use((config) => {
      config.headers = config.headers || {};
      const token = getAuthToken();
      if (token) config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    });
  }

  async create(payload: QuestionPayload) {
    const res = await this.client.post('/', payload);
    return res.data.data;
  }

  async update(id: string, payload: QuestionPayload) {
    const res = await this.client.put(`/${id}`, payload);
    return res.data.data;
  }

  async list() {
    const res = await this.client.get('/');
    return res.data.data as any[];
  }

  async remove(id: string) {
    const res = await this.client.delete(`/${id}`);
    return res.data.data;
  }
}

const questionService = new QuestionService();
export default questionService;
