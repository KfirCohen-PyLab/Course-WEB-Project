import React from 'react';

const ErrorBox = ({ error }) => {
  return (
    <div className="error-box" role="alert">
      <p className="error-title">Error:</p>
      <p>{error}</p>
    </div>
  );
};

export default ErrorBox;