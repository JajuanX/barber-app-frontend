import axios, { AxiosInstance } from 'axios';
const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '/api';
import { getAuthToken } from '../context/AuthContext';

class QuizService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({ baseURL: `${API_BASE}/quiz` });
    this.client.interceptors.request.use((config) => {
      config.headers = config.headers || {};
      const token = getAuthToken();
      if (token) config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    });
  }

  async startQuiz(category?: string) {
    const res = await this.client.post('/start', { category });
    return res.data.data as { attemptId: string; questions: QuestionDTO[] };
  }

  async submitQuiz(attemptId: string, answers: { questionId: string; selectedKey: string }[]) {
    const res = await this.client.post('/submit', { attemptId, answers });
    return res.data.data as GradeResultDTO;
  }

  async myHistory() {
    const res = await this.client.get('/history');
    return res.data.data as any[];
  }

  async attemptDetail(attemptId: string, wrongOnly = true) {
    const res = await this.client.get(`/attempts/${attemptId}`, { params: { wrongOnly } });
    return res.data.data as GradeResultDTO & { attemptId: string; submitted: boolean };
  }
}

export type QuestionDTO = {
  _id: string;
  category: string;
  text: string;
  options: { key: string; text: string }[];
};

export type FeedbackItem = {
  questionId: string;
  category: string;
  text: string;
  options: { key: string; text: string }[];
  selectedKey: string;
  correctKey: string;
  explanation?: string;
  isCorrect: boolean;
};

export type GradeResultDTO = {
  score: number;
  total: number;
  feedback: FeedbackItem[];
};

const quizService = new QuizService();
export default quizService;
