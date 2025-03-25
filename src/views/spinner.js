import React from "react";
import "../css/spinner.css"; // Make sure this file is correctly referenced

const FullPageSpinner = () => {
  return (
    <div className="full-page-spinner">
      <div className="spinner-wheel" />
    </div>
  );
};

export default FullPageSpinner;
