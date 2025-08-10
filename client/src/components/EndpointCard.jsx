import React from 'react';

// This component receives two props:
// 1. 'endpoint': The object containing the data to display.
// 2. 'onDelete': The handleDelete function passed down from App.jsx.
const EndpointCard = ({ endpoint, onDelete }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col justify-between">
      {/* Top section with info */}
      <div>
        <h3 className="text-xl font-bold">{endpoint.name}</h3>
        <p className="text-sm text-gray-400 truncate" title={endpoint.url}>
          {endpoint.url}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <span
            className={`text-lg font-semibold ${
              endpoint.status === 'Up' ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {endpoint.status}
          </span>
          <span className="text-xs text-gray-500">
            {endpoint.lastChecked ? new Date(endpoint.lastChecked).toLocaleString() : 'Never'}
          </span>
        </div>
      </div>

      {/* Bottom section with the button */}
      <button
        onClick={() => onDelete(endpoint._id)}
        className="mt-4 bg-red-800 hover:bg-red-900 text-gray-300 font-bold py-2 px-4 rounded-md w-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Delete
      </button>
    </div>
  );
};

export default EndpointCard;