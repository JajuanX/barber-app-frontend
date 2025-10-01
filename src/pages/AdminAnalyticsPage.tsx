import React, { useEffect, useMemo, useState } from 'react';
import { fetchOverview, fetchCategories, fetchStudentStats, Overview, CategoryRow, StudentStats } from '../services/AnalyticsService';
import { listUsers, UserRow } from '../services/AdminService';
import { Select } from '../components/Select';
import BarChart from '../components/BarChart';
import './AdminAnalyticsPage.scss';
import { CATEGORIES } from '../constants/categories';

const AdminAnalyticsPage: React.FC = () => {
  const [overview, setOverview] = useState<Overview | undefined>();
  const [distribution, setDistribution] = useState<{ _id: number; count: number }[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [studentStats, setStudentStats] = useState<StudentStats | undefined>();

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        // Load users list for filter
        const us = await listUsers('student');
        setUsers(us);

        const userId = selectedUser !== 'all' ? selectedUser : undefined;
        const o = await fetchOverview(userId);
        setOverview(o.overview);
        setDistribution(o.distribution);
        const c = await fetchCategories(userId);
        setCategories(c);
        if (userId) setStudentStats(await fetchStudentStats(userId));
        else setStudentStats(undefined);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [selectedUser]);

  const distData = useMemo(() => {
    // normalize buckets 0..100 step 10
    const map = new Map<number, number>();
    distribution.forEach((d) => map.set(d._id, d.count));
    const out: { label: string; value: number }[] = [];
    for (let b = 0; b <= 100; b += 10) {
      out.push({ label: `${b}`, value: map.get(b) || 0 });
    }
    return out;
  }, [distribution]);

  const catData = useMemo(() => {
    const order = new Map(CATEGORIES.map((c, i) => [c, i] as const));
    const sorted = [...categories].sort((a, b) =>
      (order.get(a.category) ?? Number.MAX_SAFE_INTEGER) - (order.get(b.category) ?? Number.MAX_SAFE_INTEGER)
    );
    return sorted.map((c) => ({
      label: `${c.category} (n=${c.total})`,
      value: Math.round(c.accuracy),
    }));
  }, [categories]);

  if (loading) return <div className="admin-analytics__status">Loading…</div>;

  return (
    <div className="admin-analytics">
      <h2 className="admin-analytics__title">Quiz Insights</h2>
      <div className="admin-analytics__filters">
        <label className="admin-analytics__filter">
          <span className="admin-analytics__filter-label">Student</span>
          <Select
            name="studentFilter"
            value={selectedUser}
            onChange={setSelectedUser}
            options={[{ value: 'all', label: 'All Students' }, ...users.map((u) => ({ value: u._id, label: `${u.name} (${u.email})` }))]}
          />
        </label>
      </div>
      {overview && (
        <div className="admin-analytics__cards">
          <div className="admin-analytics__card"><div className="admin-analytics__metric">{overview.totalAttempts}</div><div className="admin-analytics__label">Total Attempts</div></div>
          <div className="admin-analytics__card"><div className="admin-analytics__metric">{overview.avgScore.toFixed(1)}</div><div className="admin-analytics__label">Avg Score</div></div>
          <div className="admin-analytics__card"><div className="admin-analytics__metric">{overview.avgPercent.toFixed(1)}%</div><div className="admin-analytics__label">Avg Percent</div></div>
        </div>
      )}

      {studentStats && (
        <div className="admin-analytics__cards admin-analytics__cards--student">
          <div className="admin-analytics__card">
            <div className="admin-analytics__label">Last Attempt</div>
            {studentStats.last ? (
              <div className="admin-analytics__metric">{studentStats.last.score} / {studentStats.last.total} ({studentStats.last.percent.toFixed(1)}%)</div>
            ) : (
              <div className="admin-analytics__metric">—</div>
            )}
            <div className="admin-analytics__sub">{studentStats.last ? new Date(studentStats.last.createdAt).toLocaleString() : 'No attempts yet'}</div>
          </div>
          <div className="admin-analytics__card">
            <div className="admin-analytics__label">Best Score</div>
            {studentStats.best ? (
              <div className="admin-analytics__metric">{studentStats.best.score} / {studentStats.best.total} ({studentStats.best.percent.toFixed(1)}%)</div>
            ) : (
              <div className="admin-analytics__metric">—</div>
            )}
            <div className="admin-analytics__sub">{studentStats.best ? new Date(studentStats.best.createdAt).toLocaleString() : '—'}</div>
          </div>
        </div>
      )}

      <section className="admin-analytics__section">
        <h3 className="admin-analytics__subtitle">Score Distribution (percent buckets)</h3>
        <div className="admin-analytics__note">Total attempts: {overview?.totalAttempts ?? 0}</div>
        <BarChart data={distData} showValues />
      </section>

      <section className="admin-analytics__section">
        <h3 className="admin-analytics__subtitle">Category Accuracy</h3>
        <BarChart data={catData} max={100} color="#2e7d32" showValues valueFormatter={(n) => `${n}%`} labelAngle={-35} />
      </section>
    </div>
  );
};

export default AdminAnalyticsPage;
