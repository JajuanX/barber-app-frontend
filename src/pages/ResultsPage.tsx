import React from 'react';
import { Link } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import './ResultsPage.scss';

const ResultsPage: React.FC = () => {
  const { result, reset } = useQuiz();

  if (!result) return (
    <div className="results-page">
      <p className="results-page__notice">No results to show.</p>
      <Link className="results-page__restart" to="/">Go back</Link>
    </div>
  );

  const percent = Math.round((result.score / result.total) * 100);

  return (
    <div className="results-page">
      <div className="results-page__summary">
        <h2 className="results-page__title">Your Score</h2>
        <div className="results-page__score">{result.score} / {result.total} ({percent}%)</div>
        <button className="results-page__restart" onClick={reset}>Take Another Quiz</button>
      </div>

      <ul className="results-page__list">
        {result.feedback.map((f) => (
          <li key={f.questionId} className={`results-page__item ${f.isCorrect ? 'results-page__item--correct' : 'results-page__item--wrong'}`}>
            <div className="results-page__q">{f.text}</div>
            <div className="results-page__a">Your answer: <strong>{f.selectedKey}</strong> | Correct: <strong>{f.correctKey}</strong></div>
            {f.explanation && <div className="results-page__ex">{f.explanation}</div>}
          </li>
        ))}
      </ul>
      <Link className="results-page__back" to="/">Back to Quiz</Link>
    </div>
  );
};

export default ResultsPage;

