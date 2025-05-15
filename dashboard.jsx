import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = router.query;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sentRequests, setSentRequests] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`/api/history?user=${user}`)
        .then(res => res.json())
        .then(data => setSentRequests(data.requests || []));
    }
  }, [user]);

  const sendReviewRequest = async () => {
    const res = await fetch('/api/send-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, name, phone }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage('Review request sent!');
      setSentRequests([...sentRequests, { name, phone, time: new Date().toLocaleString() }]);
    } else {
      setMessage('Failed to send request.');
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Send a Review Request</h1>
      <input
        type="text"
        placeholder="Customer Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-2 p-2 rounded border w-96"
      />
      <input
        type="text"
        placeholder="Customer Phone (e.g. +15551234567)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="mb-4 p-2 rounded border w-96"
      />
      <button
        onClick={sendReviewRequest}
        className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700"
      >
        Send Request
      </button>
      {message && <p className="mt-3 text-yellow-800">{message}</p>}

      <div className="mt-8 w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-2">Sent Requests</h2>
        <ul className="space-y-2">
          {sentRequests.map((req, idx) => (
            <li key={idx} className="bg-white p-3 border rounded shadow">
              <strong>{req.name}</strong> – {req.phone} <br />
              <span className="text-sm text-gray-500">{req.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
