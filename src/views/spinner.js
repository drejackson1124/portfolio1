import React from 'react';

const FullPageSpinner = () => {
  return (
    <div className="full-page-spinner">
      <div className="spinner-border text-light" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default FullPageSpinner;

