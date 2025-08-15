import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const AddEndpointForm = ({ onEndpointAdded }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  // Get the user object (which contains the token) from the Redux state.
  const { user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !url) {
      return alert('Please fill out both name and URL.');
    }
    // We need the token to make an authenticated request.
    if (!user || !user.token) {
        return alert('You must be logged in to add an endpoint.');
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/endpoints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include the token in the Authorization header.
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name, url }),
      });

      if (!response.ok) {
        throw new Error('Failed to create endpoint');
      }
      
      setName('');
      setUrl('');
      onEndpointAdded(); // This calls fetchEndpoints in App.jsx to refresh the list.

    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-slate-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Add New Endpoint</h3>
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="API Name (e.g., My Website)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-grow bg-slate-700 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <input
          type="url"
          placeholder="URL (e.g., https://api.example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-grow bg-slate-700 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          type="submit"
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-md transition-colors"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default AddEndpointForm;