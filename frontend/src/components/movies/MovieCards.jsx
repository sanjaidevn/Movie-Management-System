// region Import
// * Using icons like 'Calendar', 'Globe', 'Tag' from Lucide
import { Calendar, Globe, Film } from 'lucide-react';
// endregion

// region Movie Cards
const MovieCards = ({ movies = [] }) => {
	const safeMovies = Array.isArray(movies) ? movies : [];

	if (safeMovies.length === 0) {
		return (
			<div className="text-center py-5">
				<p className="text-muted">No movies found match your criteria.</p>
			</div>
		);
	}

	return (
		<div className="row g-4">
			{safeMovies.map((m, index) => {
				const title = m?.title || 'Untitled Movie';
				const language = m?.language || 'Unknown';
				const genres = Array.isArray(m?.genres) ? m?.genres : [];
				const releaseYear = m?.releaseYear || 'N/A';

				return (
					<div className="col-12 col-sm-6 col-lg-4" key={m?.id || index}>
						<div className="card h-100 border-0 shadow-sm transition-hover">
							{/* Cinematic Placeholder with Gradient */}
							<div className="d-flex align-items-center justify-content-center movie-card">
								<Film size={48} color="rgba(255,255,255,0.2)" />
							</div>

							<div className="card-body p-4">
								{/* Release Year Badge */}
								<div className="d-flex justify-content-between align-items-start mb-2">
									<span className="badge rounded-pill bg-light text-primary border border-primary-subtle px-3 py-2">
										<Calendar size={12} className="me-1 mb-1" />
										{releaseYear}
									</span>
									<span className="small text-muted fw-medium d-flex align-items-center">
										<Globe size={12} className="me-1" /> {language}
									</span>
								</div>

								<h5
									className="card-title fw-bold mb-3 text-dark text-truncate"
									title={title}
								>
									{title}
								</h5>

								{/* Genre Tags */}
								<div className="d-flex flex-wrap gap-1 mt-auto">
									{genres.length > 0 ? (
										genres.map((g, i) => (
											<span
												key={i}
												className="badge bg-secondary-subtle text-secondary fw-normal border border-secondary-subtle"
											>
												{g}
											</span>
										))
									) : (
										<span className="text-muted small italic">
											No genres listed
										</span>
									)}
								</div>
							</div>

							{/* Optional Footer Action */}
							<div className="card-footer bg-transparent border-top-0 p-4 pt-0">
								<button className="btn btn-outline-dark btn-sm w-100 fw-bold">
									View Details
								</button>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
// endregion

// region Export
export { MovieCards };
// endregion
