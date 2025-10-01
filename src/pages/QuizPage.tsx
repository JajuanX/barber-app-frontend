import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';
import QuestionCard from '../components/QuestionCard';
import './QuizPage.scss';
import { CATEGORIES, ALL_CATEGORIES_OPTION } from '../constants/categories';
import { Select } from '../components/Select';

const QuizPage: React.FC = () => {
  const { loading, questions, currentIndex, answers, start, select, next, prev, submit, result } = useQuiz();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [category, setCategory] = useState<string>(ALL_CATEGORIES_OPTION);

  useEffect(() => {
    if (result) navigate('/results');
  }, [result, navigate]);

  if (questions.length === 0) {
    return (
      <div className="quiz-page quiz-page--start">
        <h2 className="quiz-page__heading">Ready to Practice?</h2>
        <p className="quiz-page__lead">Take a randomized 50‑question quiz from the pool.</p>
        <div className="quiz-page__intro">
          <h3 className="quiz-page__intro-title">What you can do</h3>
          <ul className="quiz-page__intro-list">
            <li className="quiz-page__intro-item">Start practice quizzes with questions across all categories.</li>
            <li className="quiz-page__intro-item">See detailed results with correct answers and explanations.</li>
            <li className="quiz-page__intro-item">Review past attempts on the History page and drill into wrong answers.</li>
            <li className="quiz-page__intro-item">Admins can manage questions and view analytics.</li>
          </ul>
        </div>
        {/* Category selection and start button shown below */}
        <div className="quiz-page__category">
          <label className="quiz-page__category-label">Category</label>
          <Select
            name="quizCategory"
            value={category}
            onChange={setCategory}
            options={[{ value: ALL_CATEGORIES_OPTION, label: 'All Categories' }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]}
          />
        </div>
        {user ? (
          <button
            className="quiz-page__nav-btn quiz-page__nav-btn--primary"
            onClick={() => start(category === ALL_CATEGORIES_OPTION ? undefined : category)}
            disabled={loading}
          >
            {loading ? 'Preparing…' : 'Start Quiz'}
          </button>
        ) : (
          <div className="quiz-page__login-cta">
            <p>You must be logged in to start a quiz.</p>
            <Link to="/login" className="quiz-page__nav-btn quiz-page__nav-btn--primary">Login or Create Account</Link>
          </div>
        )}
      </div>
    );
  }

  const q = questions[currentIndex];
  const selected = q ? answers[q._id] : undefined;

  const onSubmit = async () => {
    await submit();
  };

  return (
    <div className="quiz-page">
      {q && (
        <QuestionCard
          question={q}
          index={currentIndex}
          total={questions.length}
          selectedKey={selected}
          onSelect={(key) => select(q._id, key)}
        />
      )}

      <div className="quiz-page__controls">
        <button className="quiz-page__nav-btn" onClick={prev} disabled={currentIndex === 0}>
          Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button className="quiz-page__nav-btn quiz-page__nav-btn--primary" onClick={next}>
            Next
          </button>
        ) : (
          <button className="quiz-page__nav-btn quiz-page__nav-btn--primary" onClick={onSubmit}>
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
