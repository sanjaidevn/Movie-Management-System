//region Imports

// * React core hooks
import { useState } from 'react';
// * Eye Icons
import { Eye, EyeOff } from 'lucide-react';
//endregion Imports

//region Input Field Component
// * Reusable Bootstrap input field
// * Supports text, email, password, confirm password
// * Supports live validation & password mask/unmask
const InputField = ({
  // * Basic config
  name = '',
  type = 'text',
  label = '',
  placeholder = '',

  // * Controlled value
  value = '',

  // * Validation
  error = '',
  touched = false,

  // * Event handlers
  onChange = () => {},
  onBlur = () => {},

  // * Password toggle
  allowToggle = false,

  // * Autocomplete support
  autoComplete = 'off',
}) => {
  try {
    // * Local state for password visibility
    const [showPassword, setShowPassword] = useState(false);

    // * Determine final input type
    const inputType =
      allowToggle && type === 'password' ? (showPassword ? 'text' : 'password') : (type ?? 'text');

    // * Show error only when touched
    const showError = Boolean((touched ?? false) && (error ?? ''));

    return (
      <div className="mb-3">
        {/* Label */}
        {label && <label className="form-label fw-semibold">{label ?? ''}</label>}

        {/* Input + toggle wrapper */}
        <div className="position-relative d-flex align-items-center">
          <input
            name={name ?? ''}
            type={inputType}
            className={`form-control pe-5 `}
            value={value ?? ''}
            placeholder={placeholder ?? ''}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete={autoComplete ?? 'off'}
          />

          {allowToggle && type === 'password' && value && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="btn position-absolute end-0 border-0 bg-transparent py-0 px-3 h-100"
              tabIndex={-1}
              style={{ zIndex: 10, cursor: 'pointer' }}
            >
              {showPassword ? (
                <EyeOff size={18} className="text-muted" aria-hidden="true" />
              ) : (
                <Eye size={18} className="text-muted" aria-hidden="true" />
              )}
            </button>
          )}
        </div>

        {/* Validation message */}
        {showError && <div className="invalid-feedback d-block">{error ?? ''}</div>}
      </div>
    );
  } catch (error) {
    // * Safe fallback to avoid UI crash
    return null;
  }
};
//endregion Input Field Component

//region Export
export default InputField;
//endregion Export
