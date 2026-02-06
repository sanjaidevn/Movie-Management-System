//region Imports

// * React core hooks
import { useEffect, useMemo, useState } from 'react';
// * Router utilities
import { useNavigate, useSearchParams } from 'react-router-dom';
// * Redux hooks
import { useDispatch, useSelector } from 'react-redux';

// * Toast Message
import { toast } from 'react-toastify';
// * Navbar
import { AuthNavbar } from '../../components/navbar/AuthNavbar.jsx';
// * Reusable form field
import InputField from '../../components/auth/fields/InputField.jsx';

// * Auth thunks & selectors
import {
	loginThunk,
	registerThunk,
	selectAuthError,
	selectAuthLoading,
	selectAuthRole,
	selectIsAuthenticated,
	clearAuthError,
} from '../../redux/auth/authSlice.js';

// * Validation helpers and String sanitizers
import {
	trimString,
	toLowerTrim,
	validateName,
	validateEmail,
	validatePassword,
	validateConfirmPassword,
	CapitilizeFirstLetter,
} from '../../utils/commonFunctions.js';

// * Constants
import { ROUTE_PATHS, ROLES } from '../../utils/constants.js';
//endregion Imports

//region Auth Page
const AuthPage = () => {
	try {
		const dispatch = useDispatch?.();
		const navigate = useNavigate?.();

		// * Toggle between SignIn and SignUp
		const [mode, setMode] = useState('signin'); // 'signin' | 'signup'

		// * Redux state
		const isAuthenticated = useSelector(selectIsAuthenticated);
		const role = useSelector(selectAuthRole);
		const loading = useSelector(selectAuthLoading);
		const error = useSelector(selectAuthError);

		// * Search Params
		const [searchParams] = useSearchParams?.();

		// * Unified form state
		const [form, setForm] = useState({
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		});

		// * Touched tracking (same pattern as your pages)
		const [touched, setTouched] = useState({
			name: false,
			email: false,
			password: false,
			confirmPassword: false,
		});

		//region Sync Mode From URL
		useEffect(() => {
			try {
				const modeParam = searchParams?.get?.('mode') ?? '';
				if (modeParam === 'signup') {
					setMode('signup');
				} else {
					setMode('signin');
				}
			} catch (e) {
				// safe
			}
		}, [searchParams]);
		//endregion Sync Mode From URL

		//region Reset Form & Errors on Mode Change
		useEffect(() => {
			try {
				// * Clear redux auth error
				dispatch?.(clearAuthError?.());

				// * Reset form values
				setForm((prev) => ({
					name: '',
					email: prev?.email ?? '',
					password: '',
					confirmPassword: '',
				}));

				// * Reset touched flags (this removes field errors)
				setTouched({
					name: false,
					email: false,
					password: false,
					confirmPassword: false,
				});
			} catch (e) {
				// safe
			}
		}, [mode, dispatch]);
		//endregion Reset Form & Errors on Mode Change

		//region Redirect Effect
		useEffect(() => {
			try {
				if (!isAuthenticated) return;

				if ((role ?? '') === (ROLES?.ADMIN ?? 'admin')) {
					navigate?.(ROUTE_PATHS?.ADMIN_MOVIES ?? '/admin/movies', { replace: true });
					return;
				}

				navigate?.(ROUTE_PATHS?.USER_DASHBOARD ?? '/dashboard', { replace: true });
			} catch (e) {
				// safe
			}
		}, [isAuthenticated, role, navigate]);
		//endregion Redirect Effect

		//region Clear Sensitive Fields on Auth Error
		useEffect(() => {
			try {
				if (!(error ?? '')) {
					return;
				}

				toast.error(error ?? 'An Error Occured');

				// * Clear only sensitive fields
				setForm((prev) => ({
					...(prev ?? {}),
					password: '',
					confirmPassword: '',
				}));
				// * Reset touched flags (this removes field errors)
				setTouched({
					name: false,
					password: false,
					confirmPassword: false,
				});
			} catch (e) {
				// safe
			}
		}, [error]);
		//endregion Clear Sensitive Fields on Auth Error

		//region Validation
		const errors = useMemo(() => {
			try {
				return {
					name: mode === 'signup' ? validateName(form?.name ?? '') : '',
					email: validateEmail(form?.email ?? ''),
					password: validatePassword(form?.password ?? ''),
					confirmPassword:
						mode === 'signup'
							? validateConfirmPassword(
									form?.password ?? '',
									form?.confirmPassword ?? '',
								)
							: '',
				};
			} catch {
				return {};
			}
		}, [form, mode]);
		const isValid = Object?.values?.(errors ?? {})?.every?.((x) => !x);
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
			} catch {}
		};

		const handleBlur = (e) => {
			try {
				const name = e?.target?.name ?? '';
				setTouched((prev) => ({ ...(prev ?? {}), [name]: true }));
			} catch {}
		};

		const handleSubmit = async (e) => {
			try {
				e?.preventDefault?.();

				// * Force validation
				setTouched({
					name: true,
					email: true,
					password: true,
					confirmPassword: true,
				});

				if (!isValid) return;

				if (mode === 'signin') {
					await dispatch?.(
						loginThunk?.({
							email: toLowerTrim(form?.email ?? ''),
							password: trimString(form?.password ?? ''),
						}),
					)?.unwrap?.();
				} else {
					const name = trimString(form?.name ?? '');
					await dispatch?.(
						registerThunk?.({
							name: CapitilizeFirstLetter(name),
							email: toLowerTrim(form?.email ?? ''),
							password: trimString(form?.password ?? ''),
							confirmPassword: trimString(form?.confirmPassword ?? ''),
							role: 'user',
						}),
					)?.unwrap?.();
				}
				// * Clear redux auth error
				dispatch?.(clearAuthError?.());
			} catch {
				// handled by slice
			}
		};

		const handleModeChange = () => {
			setMode(mode === 'signin' ? 'signup' : 'signin');
			mode === 'signin'
				? navigate?.(`${ROUTE_PATHS?.AUTH ?? '/auth'}?mode=signup`)
				: navigate?.(`${ROUTE_PATHS?.AUTH ?? '/auth'}`);
		};
		//endregion Handlers

		return (
			<>
				<AuthNavbar />

				<div className="container mt-5" style={{ maxWidth: '520px' }}>
					<div className="card shadow-sm">
						<div className="card-body">
							<h3 className="fw-bold mb-3">
								{mode === 'signin' ? 'Sign In' : 'Sign Up'}
							</h3>

							<form onSubmit={handleSubmit}>
								{/* Name (SignUp only) */}
								{mode === 'signup' && (
									<InputField
										name="name"
										type="text"
										label="Name"
										placeholder="Enter name"
										value={form?.name ?? ''}
										error={errors?.name ?? ''}
										touched={touched?.name ?? false}
										onChange={handleChange}
										onBlur={handleBlur}
										autoComplete="name"
									/>
								)}

								{/* Email */}
								<InputField
									name="email"
									type="email"
									label="Email"
									placeholder="Enter email"
									value={form?.email ?? ''}
									error={errors?.email ?? ''}
									touched={touched?.email ?? false}
									onChange={handleChange}
									onBlur={handleBlur}
									autoComplete="email"
								/>

								{/* Password */}
								<InputField
									name="password"
									type="password"
									label="Password"
									placeholder="Enter password"
									value={form?.password ?? ''}
									error={errors?.password ?? ''}
									touched={touched?.password ?? false}
									onChange={handleChange}
									onBlur={handleBlur}
									allowToggle={true}
									autoComplete="current-password"
								/>

								{/* Confirm Password */}
								{mode === 'signup' && (
									<InputField
										name="confirmPassword"
										type="password"
										label="Confirm Password"
										placeholder="Confirm password"
										value={form?.confirmPassword ?? ''}
										error={errors?.confirmPassword ?? ''}
										touched={touched?.confirmPassword ?? false}
										onChange={handleChange}
										onBlur={handleBlur}
										allowToggle={true}
										autoComplete="new-password"
									/>
								)}

								<button
									className="btn btn-dark w-100"
									type="submit"
									disabled={!isValid || (loading ?? false)}
								>
									{loading
										? 'Please wait...'
										: mode === 'signin'
											? 'Sign in'
											: 'Sign up'}
								</button>
							</form>

							<div className="text-center mt-3 ">
								<button
									type="button"
									className="btn btn-link text-decoration-none"
									onClick={handleModeChange}
								>
									{mode === 'signin'
										? 'New user? SignUp'
										: 'Already have an account? SignIn'}
								</button>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	} catch {
		return <div className="container mt-5">Auth Page Error</div>;
	}
};
//endregion Auth Page

export default AuthPage;
