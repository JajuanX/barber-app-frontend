import React from 'react';
import { QuestionDTO } from '../services/QuizService';
import './QuestionCard.scss';

type Props = {
  question: QuestionDTO;
  selectedKey?: string;
  onSelect: (key: string) => void;
  index: number;
  total: number;
};

const QuestionCard: React.FC<Props> = ({ question, selectedKey, onSelect, index, total }) => {
  return (
    <div className="question-card">
      <div className="question-card__meta">
        <span className="question-card__category">{question.category}</span>
        <span className="question-card__progress">Question {index + 1} of {total}</span>
      </div>
      <h2 className="question-card__text">{question.text}</h2>
      <form className="question-card__options" onSubmit={(e) => e.preventDefault()}>
        {question.options.map((opt) => (
          <label key={opt.key} className={`question-card__option ${selectedKey === opt.key ? 'question-card__option--selected' : ''}`}>
            <input
              type="radio"
              name={`q-${question._id}`}
              value={opt.key}
              checked={selectedKey === opt.key}
              onChange={(e) => onSelect(e.target.value)}
            />
            <span className="question-card__option-key">{opt.key}.</span>
            <span className="question-card__option-text">{opt.text}</span>
          </label>
        ))}
      </form>
    </div>
  );
};

export default QuestionCard;

