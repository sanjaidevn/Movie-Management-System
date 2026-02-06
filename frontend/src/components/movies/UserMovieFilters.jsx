//region Imports
// * React core hooks
import { useMemo, useState, useEffect } from 'react';
// * Icons
import { Search, X, Globe, RotateCcw } from 'lucide-react';
// * React select (multi select)
import Select from 'react-select';

// * Utility Method for Capitilize first letter
import { CapitilizeFirstLetter } from '../../utils/commonFunctions.js';

// * Constants
import { LANGUAGE_OPTIONS, GENRE_OPTIONS } from '../../utils/constants.js';
//endregion Imports

//region User Movie Filters (LIVE + Genre Apply)
const UserMovieFilters = ({ filters = {}, setFilters, onReset } = {}) => {
	try {
		// * Draft state ONLY for genres
		const [draftGenres, setDraftGenres] = useState(filters?.genres ?? []);

		// * Derived flag for Reset button visibility
		const hasActiveFilters = Boolean(
			filters.search || filters.language || filters.genres.length > 0,
		);

		// * Sync draft when parent filters reset externally
		useEffect(() => {
			setDraftGenres(filters?.genres ?? []);
		}, [filters?.genres]);

		// * Show apply only when genres changed
		const showGenreApply =
			Object.keys(filters?.genres).length > 0 || Object.keys(draftGenres).length > 0;

		// * Genre options for react-select
		const genreOptions = useMemo(() => {
			return (GENRE_OPTIONS ?? []).map((g) => ({
				label: CapitilizeFirstLetter(g),
				value: g ?? '',
			}));
		}, []);

		// * Selected values for react-select
		const selectedGenres = useMemo(() => {
			return (draftGenres ?? []).map((g) => ({
				label: CapitilizeFirstLetter(g),
				value: g ?? '',
			}));
		}, [draftGenres]);

		// * LIVE search & language change
		const handleInputChange = (e) => {
			try {
				const name = e?.target?.name ?? '';
				const value = e?.target?.value ?? '';

				setFilters?.((prev) => ({
					...(prev ?? {}),
					[name]: value ?? '',
				}));
			} catch (error) {
				// safe
			}
		};

		// * Clear only search (LIVE)
		const clearSearch = () => {
			try {
				setFilters?.((prev) => ({
					...(prev ?? {}),
					search: '',
				}));
			} catch (error) {
				// safe
			}
		};

		// * Apply ONLY genres
		const applyGenres = () => {
			try {
				setFilters?.((prev) => ({
					...(prev ?? {}),
					genres: draftGenres ?? [],
				}));
			} catch (error) {
				// safe
			}
		};
		// * handle Genre Reset
		const handleGenreReset = () => {
			try {
				setDraftGenres([]);
				setFilters?.((prev) => ({
					...(prev ?? {}),
					genres: [],
				}));
			} catch (error) {
				// safe
			}
		};

		// * Reset everything
		const handleReset = () => {
			try {
				setDraftGenres([]);
				onReset?.();
			} catch (error) {
				// safe
			}
		};

		return (
			<div className="border rounded p-3 mb-3 bg-white shadow-sm">
				<div className="row g-3 align-items-end">
					{/* Search */}
					<div className="col-lg-3" title="Search Movies">
						<label className="form-label small fw-semibold">Search</label>
						<div className="input-group">
							<span className="input-group-text bg-white">
								<Search size={16} />
							</span>

							<input
								name="search"
								className="form-control"
								placeholder="Search title"
								value={filters?.search ?? ''}
								onChange={handleInputChange}
							/>

							{filters?.search ? (
								<button
									type="button"
									className="btn btn-outline-secondary"
									onClick={clearSearch}
								>
									<X size={16} />
								</button>
							) : null}
						</div>
					</div>

					{/* Language */}
					<div className="col-lg-3" title="Select Language">
						<label className="form-label small fw-semibold">Language</label>
						<div className="input-group">
							<span className="input-group-text bg-white">
								<Globe size={16} />
							</span>

							<select
								name="language"
								className="form-select"
								value={filters?.language ?? ''}
								onChange={handleInputChange}
							>
								{(LANGUAGE_OPTIONS ?? []).map((lang) => (
									<option
										key={lang ?? ''}
										value={lang === 'Select Language' ? '' : lang}
									>
										{CapitilizeFirstLetter(lang)}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Genres */}
					<div className="col-lg-5" title="Select Genres">
						<label className="form-label small fw-semibold">Genres</label>

						<div className="d-flex gap-2">
							<div className="flex-grow-1">
								<Select
									isMulti
									closeMenuOnSelect={false}
									options={genreOptions ?? []}
									value={selectedGenres ?? []}
									placeholder="Select genres"
									onChange={(values) => {
										try {
											const next =
												(values ?? []).map((v) => v?.value ?? '') ?? [];
											setDraftGenres(next);
										} catch (e) {
											// safe
										}
									}}
								/>
							</div>

							{/* Genre Apply / Reset */}
							{showGenreApply ? (
								<div className="d-flex gap-1 align-items-start">
									<button
										type="button"
										className="btn btn-primary"
										onClick={applyGenres}
										title="Apply Genres Filter"
									>
										Apply
									</button>

									<button
										type="button"
										className="btn btn-outline-secondary"
										onClick={handleGenreReset}
										title="Reset Genres Filter"
									>
										Reset
									</button>
								</div>
							) : null}
						</div>
					</div>

					{/* Global Reset */}
					<div className="col-lg-1 d-flex justify-content-end">
						{hasActiveFilters ? (
							<button
								type="button"
								className="btn btn-outline-secondary"
								onClick={handleReset}
								title="Reset Search and Filters"
							>
								<RotateCcw size={16} />
							</button>
						) : null}
					</div>
				</div>
			</div>
		);
	} catch (error) {
		console.error('UserMovieFilters error:', error);
		return null;
	}
};
//endregion User Movie Filters

export { UserMovieFilters };
