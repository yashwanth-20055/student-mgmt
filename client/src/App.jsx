import { useEffect, useState } from 'react';

const empty = { name: '', roll: '', branch: '' };

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [health, setHealth] = useState(null);

  const load = async () => {
    const r = await fetch('/api/students');
    setStudents(await r.json());
  };

  useEffect(() => {
    load();
    fetch('/health').then(r => r.json()).then(setHealth)
      .catch(() => setHealth({ status: 'DOWN', version: '?' }));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const r = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (!r.ok) { setError((await r.json()).error); return; }
    setForm(empty);
    load();
  };

  const remove = async (id) => {
    await fetch('/api/students/' + id, { method: 'DELETE' });
    load();
  };

  return (
    <main style={{ maxWidth: 640, margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui' }}>
      <h1>Student Management</h1>
      <p>Backend: {health ? `${health.status} (build ${health.version})` : 'checking...'}</p>
      <form onSubmit={submit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['name', 'roll', 'branch'].map(k => (
          <input key={k} placeholder={k} value={form[k]}
                 onChange={e => setForm({ ...form, [k]: e.target.value })} />
        ))}
        <button>Add student</button>
      </form>
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      <ul>
        {students.map(s => (
          <li key={s._id}>
            {s.roll} - {s.name} ({s.branch}){' '}
            <button onClick={() => remove(s._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}