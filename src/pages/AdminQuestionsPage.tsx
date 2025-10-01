import React, { useEffect, useMemo, useState } from 'react';
import questionService, { QuestionPayload } from '../services/QuestionService';
import { useAuth } from '../context/AuthContext';
import './AdminQuestionsPage.scss';
import { CATEGORIES } from '../constants/categories';
import { Select } from '../components/Select';

// Categories imported from constants to stay in sync with seed data

export const AdminQuestionsPage: React.FC = () => {
  const { user } = useAuth();
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [text, setText] = useState('');
  const [options, setOptions] = useState([
    { key: 'A', text: '' },
    { key: 'B', text: '' },
    { key: 'C', text: '' },
    { key: 'D', text: '' },
  ]);
  const [correctKey, setCorrectKey] = useState('A');
  const [explanation, setExplanation] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [list, setList] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [editingId, setEditingId] = useState<string | undefined>(undefined);

  const canSave = useMemo(() => text.trim().length > 3 && options.every((o) => o.text.trim().length > 0), [text, options]);

  const load = async () => {
    setLoadingList(true);
    try {
      const data = await questionService.list();
      setList(data);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => { if (user?.role === 'admin') load(); }, [user]);

  const updateOption = (idx: number, value: string) => {
    setOptions((prev) => prev.map((o, i) => (i === idx ? { ...o, text: value } : o)));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.role !== 'admin') return;
    setSaving(true);
    setError(undefined);
    try {
      const payload: QuestionPayload = { category, text, options, correctKey, explanation: explanation || undefined };
      if (editingId) {
        await questionService.update(editingId, payload);
      } else {
        await questionService.create(payload);
      }
      setText('');
      setOptions([{ key: 'A', text: '' }, { key: 'B', text: '' }, { key: 'C', text: '' }, { key: 'D', text: '' }]);
      setCorrectKey('A');
      setExplanation('');
      setEditingId(undefined);
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to create');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this question?')) return;
    await questionService.remove(id);
    await load();
  };

  const onEdit = (q: any) => {
    setEditingId(q._id);
    setCategory(q.category);
    setText(q.text);
    // Ensure options A-D order
    const map: Record<string, string> = {};
    (q.options || []).forEach((o: any) => { map[o.key] = o.text; });
    setOptions([
      { key: 'A', text: map['A'] || '' },
      { key: 'B', text: map['B'] || '' },
      { key: 'C', text: map['C'] || '' },
      { key: 'D', text: map['D'] || '' },
    ]);
    setCorrectKey(q.correctKey);
    setExplanation(q.explanation || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(undefined);
    setText('');
    setOptions([{ key: 'A', text: '' }, { key: 'B', text: '' }, { key: 'C', text: '' }, { key: 'D', text: '' }]);
    setCorrectKey('A');
    setExplanation('');
  };

  const filteredList = useMemo(() => {
    if (filterCategory === 'All') return list;
    return list.filter((q) => q.category === filterCategory);
  }, [list, filterCategory]);

  if (!user || user.role !== 'admin') {
    return <div className="admin-questions__denied">You must be an admin to manage questions.</div>;
  }

  return (
    <div className="admin-questions">
      <h2 className="admin-questions__title">Manage Questions</h2>
      <form className="admin-questions__form" onSubmit={onSubmit}>
        <label className="admin-questions__field admin-questions__field--inline">
          <span className="admin-questions__label">Category</span>
          <Select
            name="category"
            value={category}
            onChange={setCategory}
            options={CATEGORIES.map((c) => ({ value: c, label: c }))}
          />
        </label>
        <label className="admin-questions__field">
          <span className="admin-questions__label">Question</span>
          <textarea value={text} onChange={(e) => setText(e.target.value)} required rows={3} />
        </label>
        <div className="admin-questions__grid">
          {options.map((o, i) => (
            <label key={o.key} className="admin-questions__field">
              <span className="admin-questions__label">Option {o.key}</span>
              <input value={o.text} onChange={(e) => updateOption(i, e.target.value)} required />
            </label>
          ))}
        </div>
        <label className="admin-questions__field admin-questions__field--inline">
          <span className="admin-questions__label">Correct Option</span>
          <Select
            name="correctKey"
            value={correctKey}
            onChange={setCorrectKey}
            options={options.map((o) => ({ value: o.key, label: `${o.key} — ${o.text || '…'}` }))}
          />
        </label>
        <label className="admin-questions__field">
          <span className="admin-questions__label">Explanation (optional)</span>
          <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={2} />
        </label>
        {error && <div className="admin-questions__error">{error}</div>}
        <div className="admin-questions__actions">
          <button className="admin-questions__submit" type="submit" disabled={!canSave || saving}>{saving ? 'Saving…' : (editingId ? 'Save Changes' : 'Create Question')}</button>
          {editingId && (
            <button type="button" className="admin-questions__cancel" onClick={cancelEdit}>Cancel</button>
          )}
        </div>
      </form>

      <h3 className="admin-questions__subtitle">Existing Questions</h3>
      <div className="admin-questions__filters">
        <label className="admin-questions__field admin-questions__field--inline">
          <span className="admin-questions__label">Filter by Category</span>
          <Select
            name="filterCategory"
            value={filterCategory}
            onChange={setFilterCategory}
            options={[{ value: 'All', label: 'All Categories' }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]}
          />
        </label>
      </div>
      {loadingList ? (
        <div className="admin-questions__status">Loading…</div>
      ) : (
        <ul className="admin-questions__list">
          {filteredList.map((q) => (
            <li key={q._id} className="admin-questions__item">
              <div className="admin-questions__q">{q.text}</div>
              <div className="admin-questions__meta">{q.category}</div>
              <div className="admin-questions__row-actions">
                <button className="admin-questions__edit" onClick={() => onEdit(q)} type="button">Edit</button>
                <button className="admin-questions__delete" onClick={() => onDelete(q._id)} type="button">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
