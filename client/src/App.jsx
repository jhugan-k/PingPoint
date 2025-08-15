import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Header from './components/Header.jsx';
import AddEndpointForm from './components/AddEndpointForm.jsx';
import EndpointCard from './components/EndpointCard.jsx';

function App() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [endpoints, setEndpoints] = useState([]);
  const [pageStatus, setPageStatus] = useState('loading');

  const fetchEndpoints = useCallback(async () => {
    if (!user || !user.token) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/endpoints`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!response.ok) {
        if (response.status === 401) navigate('/login');
        throw new Error('Could not fetch endpoints.');
      }
      const data = await response.json();
      setEndpoints(data);
      setPageStatus('success');
    } catch (error) {
      // FIX: Use the 'error' variable in a log.
      console.error("Fetch Error:", error.message);
      if (pageStatus === 'loading') setPageStatus('error');
    }
  }, [user, navigate, pageStatus]);

  const handleDelete = async (endpointIdToDelete) => {
    if (!user || !user.token) return;
    if (!window.confirm('Are you sure you want to delete this endpoint?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/endpoints/${endpointIdToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!response.ok) throw new Error('Failed to delete endpoint');
      setEndpoints(currentEndpoints =>
        currentEndpoints.filter(endpoint => endpoint._id !== endpointIdToDelete)
      );
    } catch (error) {
      // FIX: Use the 'error' variable in a log.
      console.error("Delete Error:", error.message);
      alert('Failed to delete the endpoint.');
    }
  };

  useEffect(() => {
    if (user) {
      fetchEndpoints();
      const intervalId = setInterval(fetchEndpoints, 5000);
      return () => clearInterval(intervalId);
    } else {
      navigate('/login');
    }
  }, [user, navigate, fetchEndpoints]);

  const renderContent = () => {
    if (pageStatus === 'loading') return <p className="text-center text-gray-400">Loading dashboard...</p>;
    if (pageStatus === 'error') return <p className="text-center text-red-500">Error: Could not load data.</p>;
    if (endpoints.length === 0) return <p className="text-center text-gray-400">No endpoints monitored. Add one!</p>;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {endpoints.map((endpoint) => (
          <EndpointCard key={endpoint._id} endpoint={endpoint} onDelete={handleDelete} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white">
      <Header />
      <main className="p-8">
        <AddEndpointForm onEndpointAdded={fetchEndpoints} />
        <h2 className="text-2xl font-semibold my-6">Monitored Endpoints</h2>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;