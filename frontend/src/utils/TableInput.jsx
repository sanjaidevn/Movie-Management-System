// region Column Input
// * Column Inputs for Table Component
const movieColumns = ({ page = 1, onEdit, onDelete }) => [
	{
		header: 'S.No',
		width: '60px',
		render: (_, index) => index + 1 + (page - 1) * 10,
	},
	{ header: 'Title', accessor: 'title' },
	{ header: 'Language', accessor: 'language' },
	{
		header: 'Genres',
		render: (row) => (row.genres ?? []).join(', '),
	},
	{ header: 'Release Year', accessor: 'releaseYear' },
	{
		header: 'Actions',
		width: '180px',
		render: (row) => (
			<div className="d-flex gap-2">
				<button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(row)}>
					Edit
				</button>
				<button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(row)}>
					Delete
				</button>
			</div>
		),
	},
];

// endregion

// region Column Input
// * Column Inputs for Table Component
const logColumns = ({ page = 1, limit = 10 }) => [
	{
		header: 'S.No',
		render: (_, i) => i + 1 + (page - 1) * limit,
	},
	{ header: 'Activity', accessor: 'Activity-Type' },
	{ header: 'Method', accessor: 'Method' },
	{
		header: 'URL',
		render: (row) => (
			<span className="text-truncate d-inline-block" style={{ maxWidth: '240px' }}>
				{row?.Url ?? ''}
			</span>
		),
	},
	{ header: 'Status', accessor: 'Status-Code' },
	{ header: 'User Email', accessor: 'User-Email' },
	{ header: 'IP', accessor: 'Ip' },
	{ header: 'Duration (ms)', accessor: 'Duration-Ms' },
	{ header: 'Time', accessor: 'Created-At' },
];
// endregion

export { movieColumns, logColumns };
