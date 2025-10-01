import React, { useEffect, useState } from 'react';
import { listUsers, createUser, updateUserRole, UserRow } from '../services/AdminService';
import { Select } from '../components/Select';
import './AdminUsersPage.scss';

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'student'>('admin');
  const [error, setError] = useState<string | undefined>();

  const load = async () => {
    setLoading(true);
    try {
      const us = await listUsers();
      setUsers(us);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    try {
      await createUser({ name, email, password, role });
      setName(''); setEmail(''); setPassword(''); setRole('admin');
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create user');
    }
  };

  const toggleRole = async (u: UserRow) => {
    const newRole = u.role === 'admin' ? 'student' : 'admin';
    await updateUserRole(u._id, newRole);
    await load();
  };

  return (
    <div className="admin-users">
      <h2 className="admin-users__title">Manage Users</h2>

      <form className="admin-users__form" onSubmit={onCreate}>
        <label className="admin-users__field"><span className="admin-users__label">Name</span><input value={name} onChange={(e) => setName(e.target.value)} required /></label>
        <label className="admin-users__field"><span className="admin-users__label">Email</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label className="admin-users__field"><span className="admin-users__label">Password</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        <label className="admin-users__field admin-users__field--inline"><span className="admin-users__label">Role</span>
          <Select name="role" value={role} onChange={(v) => setRole(v as 'admin' | 'student')} options={[{ value: 'admin', label: 'Admin' }, { value: 'student', label: 'Student' }]} />
        </label>
        {error && <div className="admin-users__error">{error}</div>}
        <button className="admin-users__submit" type="submit">Create User</button>
      </form>

      <h3 className="admin-users__subtitle">All Users</h3>
      {loading ? (
        <div className="admin-users__status">Loading…</div>
      ) : (
        <ul className="admin-users__list">
          {users.map((u) => (
            <li key={u._id} className="admin-users__item">
              <div className="admin-users__info">
                <div className="admin-users__name">{u.name}</div>
                <div className="admin-users__email">{u.email}</div>
              </div>
              <div className="admin-users__role">{u.role}</div>
              <button className="admin-users__toggle" type="button" onClick={() => toggleRole(u)}>
                Make {u.role === 'admin' ? 'Student' : 'Admin'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminUsersPage;

