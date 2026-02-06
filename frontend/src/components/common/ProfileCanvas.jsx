import { useState } from 'react';
import ConfirmModal from './ConfirmModal.jsx';
import { Loader } from './Loader.jsx';

const ProfileCanvas = ({ show, onClose, user, loading, onLogout }) => {
	const [showConfirm, setShowConfirm] = useState(false);

	const name = user?.Name ?? 'User';
	const email = user?.['Email-Address'] ?? '—';
	const letter = name.charAt(0).toUpperCase();

	return (
		<>
			{/* Offcanvas */}
			<div
				className={`offcanvas offcanvas-end ${show ? 'show' : ''}`}
				style={{ visibility: show ? 'visible' : 'hidden', width: '300px' }}
				tabIndex="-1"
			>
				<div className="offcanvas-header border-bottom">
					<h5 className="offcanvas-title">Profile</h5>
					<button type="button" className="btn-close" onClick={onClose} />
				</div>

				<div className="offcanvas-body d-flex flex-column align-items-center gap-3">
					{/* Avatar */}
					<div
						className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
						style={{
							width: 80,
							height: 80,
							fontSize: 32,
							background: `${user?.Role === 'user' ? 'linear-gradient(135deg, #1e1e2f 0%, #4e54c8 100%)' : ''}`,
						}}
					>
						{letter}
					</div>

					{/* User Info */}
					<div className="text-center">
						<div className="fw-bold" title="Name">
							{name}
						</div>
						<div className="text-muted small" title="Email">
							{email}
						</div>
					</div>

					{/* <div className="flex-grow-1" /> */}

					{/* Logout */}
					<button
						className="btn btn-outline-danger btn-sm w-50"
						onClick={() => setShowConfirm(true)}
						disabled={loading}
						title="log out"
					>
						{loading ? <Loader /> : 'Logout'}
					</button>
				</div>
			</div>

			{/* Confirm Logout */}
			<ConfirmModal
				show={showConfirm}
				title="Logout"
				message="Are you sure you want to logout?"
				confirmText="Logout"
				cancelText="Cancel"
				loading={loading}
				onCancel={() => setShowConfirm(false)}
				onConfirm={async () => {
					await onLogout();
					setShowConfirm(false);
				}}
			/>
		</>
	);
};

export default ProfileCanvas;
