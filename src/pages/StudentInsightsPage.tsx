import React, { useEffect, useMemo, useState } from 'react';
import { fetchMyOverview, fetchMyCategories, fetchMySummary, Overview, CategoryRow, StudentStats } from '../services/AnalyticsService';
import BarChart from '../components/BarChart';
import './AdminAnalyticsPage.scss';

const StudentInsightsPage: React.FC = () => {
  const [overview, setOverview] = useState<Overview | undefined>();
  const [distribution, setDistribution] = useState<{ _id: number; count: number }[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [summary, setSummary] = useState<StudentStats | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const o = await fetchMyOverview();
        setOverview(o.overview);
        setDistribution(o.distribution);
        setCategories(await fetchMyCategories());
        setSummary(await fetchMySummary());
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const distData = useMemo(() => {
    const map = new Map<number, number>();
    distribution.forEach((d) => map.set(d._id, d.count));
    const out: { label: string; value: number }[] = [];
    for (let b = 0; b <= 100; b += 10) out.push({ label: `${b}`, value: map.get(b) || 0 });
    return out;
  }, [distribution]);

  const catData = useMemo(() => categories.map((c) => ({ label: `${c.category} (n=${c.total})`, value: Math.round(c.accuracy) })), [categories]);

  if (loading) return <div className="admin-analytics__status">Loading…</div>;

  return (
    <div className="admin-analytics">
      <h2 className="admin-analytics__title">My Quiz Insights</h2>

      {summary && (
        <div className="admin-analytics__cards admin-analytics__cards--student">
          <div className="admin-analytics__card">
            <div className="admin-analytics__label">Last Attempt</div>
            {summary.last ? (
              <div className="admin-analytics__metric">{summary.last.score} / {summary.last.total} ({summary.last.percent.toFixed(1)}%)</div>
            ) : (
              <div className="admin-analytics__metric">—</div>
            )}
            <div className="admin-analytics__sub">{summary.last ? new Date(summary.last.createdAt).toLocaleString() : 'No attempts yet'}</div>
          </div>
          <div className="admin-analytics__card">
            <div className="admin-analytics__label">Best Score</div>
            {summary.best ? (
              <div className="admin-analytics__metric">{summary.best.score} / {summary.best.total} ({summary.best.percent.toFixed(1)}%)</div>
            ) : (
              <div className="admin-analytics__metric">—</div>
            )}
            <div className="admin-analytics__sub">{summary.best ? new Date(summary.best.createdAt).toLocaleString() : '—'}</div>
          </div>
        </div>
      )}

      {overview && (
        <div className="admin-analytics__cards">
          <div className="admin-analytics__card"><div className="admin-analytics__metric">{overview.totalAttempts}</div><div className="admin-analytics__label">Total Attempts</div></div>
          <div className="admin-analytics__card"><div className="admin-analytics__metric">{overview.avgScore.toFixed(1)}</div><div className="admin-analytics__label">Avg Score</div></div>
          <div className="admin-analytics__card"><div className="admin-analytics__metric">{overview.avgPercent.toFixed(1)}%</div><div className="admin-analytics__label">Avg Percent</div></div>
        </div>
      )}

      <section className="admin-analytics__section">
        <h3 className="admin-analytics__subtitle">My Score Distribution</h3>
        <div className="admin-analytics__note">Total attempts: {overview?.totalAttempts ?? 0}</div>
        <BarChart data={distData} showValues />
      </section>

      <section className="admin-analytics__section">
        <h3 className="admin-analytics__subtitle">My Category Accuracy</h3>
        <BarChart
          data={catData}
          max={100}
          color="#2e7d32"
          showValues
          valueFormatter={(n) => `${n}%`}
          labelWrapChars={16}
          labelFontSize={12}
          minBarWidth={72}
          height={220}
        />
      </section>
    </div>
  );
};

export default StudentInsightsPage;

