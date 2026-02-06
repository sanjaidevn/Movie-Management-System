//region Imports

// * React Select for multi-select dropdown
import Select from 'react-select';
// * React core hooks for managing state, effects, and memoization
import { useEffect, useMemo, useState } from 'react';

// * Validation logic for movie metadata fields like title, language, genres, and year and Utility functions
import {
	trimString,
	safeArray,
	validateMovieTitle,
	validateLanguage,
	validateGenres,
	validateReleaseYear,
	CapitilizeFirstLetter,
} from '../../utils/commonFunctions.js';

// * Constants
import { LANGUAGE_OPTIONS, GENRE_OPTIONS } from '../../utils/constants.js';
//endregion Imports

//region Movie Form Modal
// * MovieFormModal Component
// * Reusable modal for both creating and editing movie records.
// * Manages its own internal form state and validation logic.
const MovieFormModal = ({
	show = false,
	mode = 'add',
	movie = null,
	onClose = () => {},
	onSubmit = () => {},
	error = '',
} = {}) => {
	try {
		// * Submit-level error (eg: duplicate movie)
		const [submitError, setSubmitError] = useState('');

		// * Local state for the movie entry form
		const [form, setForm] = useState({
			title: '',
			language: '',
			genres: [],
			releaseYear: '',
		});

		// * UI state to track field focus to handle validation message timing
		const [touched, setTouched] = useState({
			title: false,
			language: false,
			genres: false,
		});

		// * react-select compatible options
		const GENRE_SELECT_OPTIONS = (GENRE_OPTIONS ?? []).map((g) => ({
			label: CapitilizeFirstLetter(g),
			value: g,
		}));

		// * react-select Genre Values
		const GENRE_SELECT_VALUES = (safeArray(form?.genres ?? []) ?? []).map((g) => ({
			label: CapitilizeFirstLetter(g),
			value: g,
		}));

		// * Effect: Syncs the form with the 'movie' prop if in 'edit' mode.
		// * Resets the form to default if switching to 'add' mode.
		useEffect(() => {
			try {
				setSubmitError(''); // * Clear error when modal opens / mode changes

				if ((mode ?? '') === 'edit' && movie) {
					setForm({
						title: movie?.title ?? '',
						language: movie?.language ?? '',
						genres: safeArray(movie?.genres ?? []),
						releaseYear: movie?.releaseYear ?? '',
					});
				} else {
					setForm({
						title: '',
						language: '',
						genres: [],
						releaseYear: '',
					});
				}
			} catch (err) {
				// safe
			}
		}, [mode, movie]);

		// * useMemo: Calculates validation errors for each field based on current form state.
		const errors = useMemo(() => {
			try {
				return {
					title: validateMovieTitle(form?.title ?? ''),
					language: validateLanguage(form?.language ?? ''),
					genres: validateGenres(form?.genres ?? []),
					releaseYear: validateReleaseYear(form?.releaseYear ?? ''),
				};
			} catch (err) {
				return {};
			}
		}, [form]);

		// * Helper to check if the modal can proceed with submission
		const isValid = Object?.values?.(errors ?? {})?.every?.((x) => !x);

		// * Visibility logic for error messages: shown only if touched or data exists
		const showTitleError = Boolean(
			(touched?.title ?? false) || (form?.title ?? '')?.length > 0,
		);
		const showLanguageError = Boolean(
			(touched?.language ?? false) || (form?.language ?? '')?.length > 0,
		);
		const showGenresError = Boolean(
			(touched?.genres ?? false) || safeArray(form?.genres ?? [])?.length > 0,
		);

		// * Generic change handler for standard input types (text, select)
		const handleChange = (e) => {
			try {
				const name = e?.target?.name ?? '';
				const value = e?.target?.value ?? '';

				setSubmitError(''); // * Clear submit error on edit

				setForm((prev) => ({
					...(prev ?? {}),
					[name]: value ?? '',
				}));
			} catch (err) {
				// safe
			}
		};

		// * react-select genre handler
		const handleGenresSelect = (selected = []) => {
			try {
				setSubmitError('');

				const values = (selected ?? [])?.map?.((opt) => opt?.value ?? '') ?? [];

				setForm((prev) => ({
					...(prev ?? {}),
					genres: values ?? [],
				}));
			} catch (error) {
				// safe
			}
		};

		// * Marks a field as interacted with when user leaves the input
		const handleBlur = (e) => {
			try {
				const name = e?.target?.name ?? '';
				setTouched((prev) => ({ ...(prev ?? {}), [name]: true }));
			} catch (err) {
				// safe
			}
		};

		// * Local submit handler that finalizes validation and prepares the payload
		const handleSubmit = async () => {
			try {
				// * Trigger all error displays on submit attempt
				setTouched({
					title: true,
					language: true,
					genres: true,
				});

				setSubmitError('');

				if (!isValid) return;

				const releaseYearNum = form?.releaseYear ? Number(form?.releaseYear ?? 0) : null;

				const payload = {
					title: trimString(form?.title ?? ''),
					language: trimString(form?.language ?? ''),
					genres: safeArray(form?.genres ?? []),
					releaseYear: releaseYearNum ?? null,
				};

				onSubmit?.(payload ?? {});
			} catch (err) {
				// * Extract meaningful error message
				const message = err?.payload?.message ?? err?.message ?? 'Movie already exists';

				setSubmitError(message);
			}
		};

		// * If modal is not active, return null to keep the DOM clean
		if (!show) return null;

		return (
			<div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title fw-bold">
								{(mode ?? '') === 'edit' ? 'Edit Movie' : 'Add Movie'}
							</h5>
							<button
								type="button"
								className="btn-close"
								onClick={() => onClose?.()}
							/>
						</div>

						<div className="modal-body">
							{/* Movie Title Input */}
							<div className="mb-3">
								<label className="form-label fw-semibold">Title</label>
								<input
									name="title"
									className="form-control"
									value={form?.title ?? ''}
									onChange={handleChange}
									onBlur={handleBlur}
									placeholder="Enter title"
								/>
								{showTitleError && errors?.title ? (
									<small className="text-danger">{errors?.title ?? ''}</small>
								) : null}
							</div>

							{/* Movie Language Dropdown */}
							<div className="mb-3">
								<label className="form-label fw-semibold">Language</label>
								<select
									name="language"
									className="form-select"
									value={form?.language ?? ''}
									onChange={handleChange}
									onBlur={handleBlur}
								>
									{(LANGUAGE_OPTIONS ?? [])?.map?.((lang, index) => (
										<option
											key={index ?? ''}
											value={
												lang === 'Select Language'
													? ''
													: CapitilizeFirstLetter?.(lang)
											}
										>
											{CapitilizeFirstLetter?.(lang) ?? ''}
										</option>
									))}
								</select>
								{showLanguageError && errors?.language ? (
									<small className="text-danger">{errors?.language ?? ''}</small>
								) : null}
							</div>

							{/* Movie Genres Multi-Select */}
							<div className="mb-3">
								<label className="form-label fw-semibold">Genres</label>
								<Select
									isMulti
									closeMenuOnSelect={false}
									options={GENRE_SELECT_OPTIONS ?? []}
									value={GENRE_SELECT_VALUES ?? []}
									onChange={handleGenresSelect}
									onBlur={() =>
										setTouched((prev) => ({ ...(prev ?? {}), genres: true }))
									}
									placeholder="Select genres..."
									classNamePrefix="react-select"
								/>
								{showGenresError && errors?.genres ? (
									<small className="text-danger d-block">
										{errors?.genres ?? ''}
									</small>
								) : null}
							</div>

							{/* Release Year Input */}
							<div className="mb-3">
								<label className="form-label fw-semibold">
									Release Year (optional)
								</label>
								<input
									name="releaseYear"
									type="text"
									className="form-control"
									value={form?.releaseYear ?? ''}
									onChange={handleChange}
									placeholder="Example: 2024"
								/>
								{errors?.releaseYear ? (
									<small className="text-danger">{errors?.releaseYear}</small>
								) : null}
							</div>
						</div>

						<div className="modal-footer d-flex justify-content-around">
							{/* Close and Action Buttons */}
							<button className="btn btn-outline-danger" onClick={() => onClose?.()}>
								Cancel
							</button>

							<button
								className="btn btn-primary"
								onClick={handleSubmit}
								disabled={!isValid}
							>
								{(mode ?? '') === 'edit' ? 'Update' : 'Create'}
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	} catch (error) {
		// * Component fallback to prevent modal crashes from affecting the whole page
		return null;
	}
};
//endregion Movie Form Modal

export { MovieFormModal };
