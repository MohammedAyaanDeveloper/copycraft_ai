import React from 'react';

const FAQ: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto text-gray-200">
      <h1 className="text-3xl font-bold mb-4">FAQ</h1>
      <div className="mb-4">
        <h3 className="font-semibold">How is user data stored?</h3>
        <p>Generation history and presets are stored in your browser's local storage by default. You can clear them anytime.</p>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">How many generations can I do?</h3>
        <p>There is a daily credit limit shown in the header. You can change this behavior by configuring a backend for persistence.</p>
      </div>
    </div>
  );
};

export default FAQ;
