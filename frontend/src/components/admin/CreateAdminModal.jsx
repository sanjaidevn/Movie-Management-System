//region Imports

// * React core hooks
import { useEffect, useMemo, useState } from 'react';
// * Redux hooks
import { useDispatch, useSelector } from 'react-redux';

// * React Toast Messasge
import { toast } from 'react-toastify';
// * Reusable input field
import InputField from '../auth/fields/InputField.jsx';

// * Admin register thunk + selectors
import {
	selectCreateAdminLoading,
	selectAuthError,
	clearAuthError,
	createAdminThunk,
} from '../../redux/auth/authSlice.js';

// * Validation helpers and String helpers
import {
	trimString,
	toLowerTrim,
	validateName,
	validateEmail,
	validatePassword,
	validateConfirmPassword,
} from '../../utils/commonFunctions.js';
//endregion Imports

//region Create Admin Modal
const CreateAdminModal = ({ show = false, onClose }) => {
	try {
		const dispatch = useDispatch?.();
		const loading = useSelector(selectCreateAdminLoading);
		const authError = useSelector(selectAuthError);
		//region Initial State
		const initialForm = {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		};

		const [form, setForm] = useState(initialForm);

		const [touched, setTouched] = useState({
			name: false,
			email: false,
			password: false,
			confirmPassword: false,
		});
		//endregion Initial State

		// * Error Toast Message
		useEffect(() => {
			if (authError) {
				toast.error(authError ?? 'An Error Occurred');
			}
		}, [authError]);

		//region Reset On Close / Open
		useEffect(() => {
			try {
				if (!show) {
					// * Reset form & touched state
					setForm(initialForm);
					setTouched({
						name: false,
						email: false,
						password: false,
						confirmPassword: false,
					});

					// * Clear auth errors
					dispatch?.(clearAuthError?.());
				}
			} catch {
				// safe
			}
		}, [show, dispatch]);
		//endregion Reset

		//region Clear input fields on Auth Error
		useEffect(() => {
			try {
				if (authError !== '') {
					// * Reset form & touched state
					setForm((prev) => ({ ...initialForm, name: prev.name }));
					setTouched({
						name: false,
						email: false,
						password: false,
						confirmPassword: false,
					});
				}
			} catch {
				// safe
			}
		}, [authError]);
		//endregion Reset

		//region Validation
		const errors = useMemo(() => {
			try {
				return {
					name: validateName(form?.name ?? ''),
					email: validateEmail(form?.email ?? ''),
					password: validatePassword(form?.password ?? ''),
					confirmPassword: validateConfirmPassword(
						form?.password ?? '',
						form?.confirmPassword ?? '',
					),
				};
			} catch {
				return {};
			}
		}, [form]);

		const isValid = Object?.values?.(errors ?? {})?.every?.((e) => !e);
		//endregion Validation

		//region Handlers
		const handleChange = (e) => {
			try {
				const name = e?.target?.name ?? '';
				const value = e?.target?.value ?? '';

				setForm((prev) => ({
					...(prev ?? {}),
					[name]: value ?? '',
				}));
			} catch {
				// safe
			}
		};

		const handleBlur = (e) => {
			try {
				const name = e?.target?.name ?? '';
				setTouched((prev) => ({ ...(prev ?? {}), [name]: true }));
			} catch {
				// safe
			}
		};

		const handleSubmit = async () => {
			try {
				setTouched({
					name: true,
					email: true,
					password: true,
					confirmPassword: true,
				});

				if (!isValid) return;

				await dispatch(
					createAdminThunk({
						name: trimString(form?.name ?? ''),
						email: toLowerTrim(form?.email ?? ''),
						password: trimString(form?.password ?? ''),
						confirmPassword: trimString(form?.confirmPassword ?? ''),
						role: 'admin',
					}),
				).unwrap();

				onClose?.();
			} catch (err) {
				// safe
			}
		};
		//endregion Handlers

		// * Do not render modal if closed
		if (!show) return null;

		return (
			<div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
				<div className="modal-dialog">
					<div className="modal-content">
						{/* Header */}
						<div className="modal-header">
							<h5 className="fw-bold">Create Admin</h5>
							<button className="btn-close" onClick={onClose} />
						</div>

						{/* Body */}
						<div className="modal-body">
							<InputField
								name="name"
								label="Name"
								value={form?.name ?? ''}
								error={errors?.name ?? ''}
								touched={touched?.name ?? false}
								onChange={handleChange}
								onBlur={handleBlur}
								placeholder="Enter name"
							/>
							<InputField
								name="email"
								type="email"
								label="Email"
								value={form?.email ?? ''}
								error={errors?.email ?? ''}
								touched={touched?.email ?? false}
								onChange={handleChange}
								onBlur={handleBlur}
								placeholder="Enter email"
							/>
							<InputField
								name="password"
								type="password"
								label="Password"
								value={form?.password ?? ''}
								error={errors?.password ?? ''}
								touched={touched?.password ?? false}
								onChange={handleChange}
								onBlur={handleBlur}
								allowToggle={true}
								placeholder="Enter Password"
								autoComplete="current-password"
							/>
							<InputField
								name="confirmPassword"
								type="password"
								label="Confirm Password"
								value={form?.confirmPassword ?? ''}
								error={errors?.confirmPassword ?? ''}
								touched={touched?.confirmPassword ?? false}
								onChange={handleChange}
								onBlur={handleBlur}
								allowToggle={true}
								placeholder="Confirm Password"
								autoComplete="new-password"
							/>
						</div>

						{/* Footer */}
						<div className="modal-footer">
							<button className="btn btn-outline-secondary" onClick={onClose}>
								Cancel
							</button>

							<button
								className="btn btn-dark"
								disabled={!isValid || loading}
								onClick={handleSubmit}
							>
								{loading ? 'Creating...' : 'Create'}
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	} catch {
		return null;
	}
};
//endregion Create Admin Modal

export { CreateAdminModal };
