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
  // This new state tracks if the initial load is taking longer than a few seconds.
  const [showSlowLoadMessage, setShowSlowLoadMessage] = useState(false);

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
      console.error("Delete Error:", error.message);
      alert('Failed to delete the endpoint.');
    }
  };

  // Main effect for fetching data and starting the polling interval.
  useEffect(() => {
    if (user) {
      fetchEndpoints();
      const intervalId = setInterval(fetchEndpoints, 5000);
      return () => clearInterval(intervalId);
    } else {
      navigate('/login');
    }
  }, [user, navigate, fetchEndpoints]);

  // This new effect is dedicated to managing the slow load message.
  useEffect(() => {
    let timer;
    // If the page is in its initial loading state...
    if (pageStatus === 'loading') {
      // ...set a timer for 3 seconds.
      timer = setTimeout(() => {
        // If the timer completes, it means we're still loading, so show the detailed message.
        setShowSlowLoadMessage(true);
      }, 3000); // 3 seconds
    }

    // This is a cleanup function. If the pageStatus changes from 'loading' to 'success'
    // before the 3 seconds are up, this will cancel the timer.
    return () => {
      clearTimeout(timer);
    };
  }, [pageStatus]); // This effect only runs when pageStatus changes.

  const renderContent = () => {
    if (pageStatus === 'loading') {
      // Conditionally render the message based on whether the load is slow.
      return (
        <div className="text-center text-gray-400">
          {showSlowLoadMessage ? (
            <>
              <p>Waking up the server...</p>
              <p className="text-sm mt-2">This can take up to 30 seconds for the first request.</p>
            </>
          ) : (
            <p>Loading dashboard...</p>
          )}
        </div>
      );
    }
    if (pageStatus === 'error') {
      return <p className="text-center text-red-500">Error: Could not load data. Please ensure the server is running and refresh the page.</p>;
    }
    if (endpoints.length === 0) {
      return <p className="text-center text-gray-400">No endpoints are being monitored. Add one to get started!</p>;
    }
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