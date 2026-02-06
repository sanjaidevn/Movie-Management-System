//region Imports
import React from 'react';
//endregion Imports

//region Empty State
const EmptyState = ({ title = 'No Data', message = '' } = {}) => {
  try {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center">
          <h5 className="fw-bold">{title ?? 'No Data'}</h5>
          <p className="text-muted mb-0">{message ?? ''}</p>
        </div>
      </div>
    );
  } catch (error) {
    return null;
  }
};
//endregion Empty State

export { EmptyState };
