//region Imports

// * React core
import React from 'react';

//endregion Imports

//region Confirm Modal Component
const ConfirmModal = ({
  show = false,
  title = 'Confirm',
  message = 'Are you sure?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm = () => {},
  onCancel = () => {},
  loading = false,
}) => {
  try {
    if (!show) return null;

    return (
      <>
        {/* Backdrop */}
        <div className="modal-backdrop fade show" style={{ zIndex: 1050 }} onClick={onCancel} />

        {/* Modal */}
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ zIndex: 1050 }}
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              {/* Header */}
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{title ?? 'Confirm'}</h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={onCancel}
                  disabled={loading ?? false}
                />
              </div>

              {/* Body */}
              <div className="modal-body">
                <p className="mb-0">{message ?? ''}</p>
              </div>

              {/* Footer */}
              <div className="modal-footer d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onCancel}
                  disabled={loading ?? false}
                >
                  {cancelText ?? 'Cancel'}
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={onConfirm}
                  disabled={loading ?? false}
                >
                  {loading ? 'Please wait…' : confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('ConfirmModal error:', error);
    return null;
  }
};
//endregion Confirm Modal Component

//region Export
export default ConfirmModal;
//endregion Export
