import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import quizService, { FeedbackItem } from '../services/QuizService';
import './AttemptDetailPage.scss';

type AttemptDetail = { attemptId: string; score: number; total: number; submitted: boolean; feedback: FeedbackItem[] };

const AttemptDetailPage: React.FC = () => {
  const { attemptId } = useParams();
  const [data, setData] = useState<AttemptDetail | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!attemptId) return;
      setLoading(true);
      try {
        const res = await quizService.attemptDetail(attemptId, true);
        setData(res as AttemptDetail);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [attemptId]);

  if (loading || !data) return <div className="attempt-detail__status">Loading…</div>;

  const wrongCount = data.feedback.length;

  return (
    <div className="attempt-detail">
      <h2 className="attempt-detail__title">Wrong Answers ({wrongCount})</h2>
      <p className="attempt-detail__summary">Score: {data.score} / {data.total}</p>
      <ul className="attempt-detail__list">
        {data.feedback.map((f) => (
          <li key={f.questionId} className="attempt-detail__item">
            <div className="attempt-detail__q">{f.text}</div>
            <div className="attempt-detail__a">Your answer: <strong>{f.selectedKey || 'No answer'}</strong> | Correct: <strong>{f.correctKey}</strong></div>
            {f.explanation && <div className="attempt-detail__ex">{f.explanation}</div>}
          </li>
        ))}
      </ul>
      <Link className="attempt-detail__back" to="/history">Back to History</Link>
    </div>
  );
};

export default AttemptDetailPage;
