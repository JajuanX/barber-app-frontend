import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import quizService from '../services/QuizService';
import './HistoryPage.scss';

type Attempt = { _id: string; score: number; questionIds: string[]; createdAt: string };

const HistoryPage: React.FC = () => {
  const [items, setItems] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const data = await quizService.myHistory();
        setItems(data as any);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <div className="history-page">
      <h2 className="history-page__title">My Past Scores</h2>
      {loading ? (
        <div className="history-page__status">Loading…</div>
      ) : (
        <ul className="history-page__list">
          {items.map((a) => (
            <li key={a._id} className="history-page__item">
              <span className="history-page__score">{a.score} / {a.questionIds.length}</span>
              <span className="history-page__date">{new Date(a.createdAt).toLocaleString()}</span>
              <Link className="history-page__link" to={`/history/${a._id}`}>View wrong answers</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoryPage;
