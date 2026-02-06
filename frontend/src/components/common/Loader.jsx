//region Imports
import React from 'react';
//endregion Imports

//region Loader
const Loader = () => {
  try {
    return (
      <div className="d-flex justify-content-center align-items-center my-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  } catch (error) {
    return null;
  }
};
//endregion Loader

export { Loader };
