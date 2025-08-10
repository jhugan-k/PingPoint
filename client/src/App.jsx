import React, { useState, useEffect } from 'react';
import AddEndpointForm from './components/AddEndpointForm.jsx';
import EndpointCard from './components/EndpointCard.jsx';

function App() {
  const [endpoints, setEndpoints] = useState([]);
  // We track the status of the *initial* page load.
  // It can be 'loading', 'error', or 'success'.
  const [pageStatus, setPageStatus] = useState('loading');

  // This function is now lean. Its only job is to fetch and update data.
  const fetchEndpoints = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/endpoints');
      if (!response.ok) {
        // If a poll fails, we don't want to crash the whole page with an error.
        // We log it and the next poll will try again.
        console.error('A background poll failed. The server might be temporarily down.');
        return; // Exit the function early for this poll cycle.
      }
      const data = await response.json();
      setEndpoints(data);
      // Once data is successfully fetched for the first time, the page status is 'success'.
      setPageStatus('success');
    } catch (error) {
      console.error('Error fetching endpoints:', error);
      // Only set a page-level error if the very first load fails.
      if (pageStatus === 'loading') {
        setPageStatus('error');
      }
    }
  };

  const handleDelete = async (endpointIdToDelete) => {
    if (!window.confirm('Are you sure you want to delete this endpoint?')) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/api/endpoints/${endpointIdToDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete endpoint');
      }
      // Instantly update the UI by filtering the state.
      setEndpoints(currentEndpoints =>
        currentEndpoints.filter(endpoint => endpoint._id !== endpointIdToDelete)
      );
    } catch (error) {
      console.error('Error deleting endpoint:', error);
      alert('Failed to delete the endpoint.');
    }
  };

  useEffect(() => {
    fetchEndpoints(); // Initial fetch
    const intervalId = setInterval(fetchEndpoints, 5000); // Poll every 5 seconds
    return () => clearInterval(intervalId); // Cleanup
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // The empty array is correct.

  // This logic now correctly decides what to show on the page.
  const renderContent = () => {
    if (pageStatus === 'loading') {
      return <p className="text-center text-gray-400">Loading dashboard...</p>;
    }
    if (pageStatus === 'error') {
      return <p className="text-center text-red-500">Error: Could not load initial data. Please ensure the server is running and refresh the page.</p>;
    }
    // This condition handles a successful load that returns no data.
    if (endpoints.length === 0) {
      return <p className="text-center text-gray-400">You're not monitoring any endpoints yet. Add one above to get started!</p>;
    }
    // The success case: render the grid.
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {endpoints.map((endpoint) => (
          <EndpointCard
            key={endpoint._id}
            endpoint={endpoint}
            onDelete={handleDelete}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white">
      <header className="bg-slate-800 p-4 shadow-md">
        <h1 className="text-3xl font-bold text-center text-cyan-400">
          PingPoint Dashboard
        </h1>
      </header>
      <main className="p-8">
        <AddEndpointForm onEndpointAdded={fetchEndpoints} />
        <h2 className="text-2xl font-semibold my-6">Monitored Endpoints</h2>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;