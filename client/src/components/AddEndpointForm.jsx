import React, { useState } from 'react';

// We accept a function 'onEndpointAdded' as a prop
// This will be the function from App.jsx that refetches the data
const AddEndpointForm = ({ onEndpointAdded }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = async (e) => {
    // Prevents the default browser form submission (which causes a page reload)
    e.preventDefault();

    if (!name || !url) {
      alert('Please fill out both name and URL.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, url }),
      });

      if (!response.ok) {
        // If the server responds with an error status (4xx, 5xx)
        throw new Error('Failed to create endpoint');
      }
      
      // Clear the form fields after successful submission
      setName('');
      setUrl('');

      // Call the function passed down from the parent (App.jsx)
      // to signal that it should refetch the list.
      onEndpointAdded();

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